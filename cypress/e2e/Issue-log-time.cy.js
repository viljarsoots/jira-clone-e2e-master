const issueDetails = {
  title: "New Issue for Time logging",
  type: "Bug",
  timeSpent: 2,
  timeRemaining: 5,
  timeEstimated: 10,
  newEstimation: 20,
  estimationDeleted: "",
  timeSpentDeleted: "",
  timeRemainingDeleted: "",
};

const EXPECTED_AMOUNT_OF_ISSUES = "5";
const issueModal = '[data-testid="modal:issue-create"]';
const issueDetailModal = '[data-testid="modal:issue-details"]';
const closeButton = '[data-testid="icon:close"]';
const timeTrackingModal = '[data-testid="modal:tracking"]';
const submitButton = 'button[type="submit"]';
const backlogList = '[data-testid="board-list:backlog"]';
const issuesList = '[data-testid="list-issue"]';
const doneButtonName = "Done";
const timeLoggedText = "h logged";
const timeRemainingText = "h remaining";
const avatarLordGaben = '[data-testid="avatar:Lord Gaben"]';
const estimatedTimeText = "h estimated";

const timeTracking = () => cy.get('[data-testid="icon:stopwatch"]').next();
const timeEstimatedField = () => cy.get('input[placeholder="Number"]').eq(0);
const timeSpentField = () => cy.get('input[placeholder="Number"]').eq(1);
const timeRemainingField = () => cy.get('input[placeholder="Number"]').eq(2);

describe("Test time logging functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", "https://jira.ivorreic.com/project")
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create new Issue and test time estimation functionality", () => {
    cy.log("New Issue Is created");
    createIssue(issueDetails);
    ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);
    cy.log("Time estimation is added and checked");
    openIssue(issueDetails);
    checkNoTimeLogged();
    estimationChanging(issueDetails.timeEstimated);
    reOpenIssue(issueDetails);
    ensureEstimationIsLogged(issueDetails.timeEstimated);
    cy.log("Time estimation is edited and checked");
    estimationChanging(issueDetails.newEstimation);
    reOpenIssue(issueDetails);
    ensureEstimationIsLogged(issueDetails.newEstimation);
    cy.log("Time estimation is removed and checked");
    estimationChanging(issueDetails.estimationDeleted);
    reOpenIssue(issueDetails);
    ensureEstimationIsLogged(issueDetails.estimationDeleted);
  });

  it(" Should create new Issue and test time logging functionality", () => {
    cy.log("New Issue Is created");
    createIssue(issueDetails);
    ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);
    cy.log("Time estimation is added and checked");
    openIssue(issueDetails);
    timeTracking().should("contain", "No time logged");
    estimationChanging(issueDetails.timeEstimated);
    closeDetailModal();
    cy.log("Time Logging is added and checked");
    openIssue(issueDetails);
    clickTimeTracking();
    logTime(issueDetails.timeSpent, issueDetails.timeRemaining);
    ensureTimeIsLogged(issueDetails.timeSpent, issueDetails.timeRemaining);
    closeDetailModal();
    cy.log("Removing logged time and checking that it is removed");
    openIssue(issueDetails);
    clickTimeTracking();
    logTime(issueDetails.timeSpentDeleted, issueDetails.timeRemainingDeleted);
    reOpenIssue(issueDetails);
    ensureTimeIsLogged(
      issueDetails.timeSpentDeleted,
      issueDetails.timeRemainingDeleted
    );
    ensureEstimationIsLogged(issueDetails.timeEstimated);
  });
});

function createIssue(issueDetails) {
  cy.get(issueModal).within(() => {
    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="select-option:Bug"]').trigger("click");
    cy.get('input[name="title"]')
      .trigger("mouseover")
      .click()
      .type(issueDetails.title);
    cy.get(submitButton).click();
  });
}

function ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
  cy.get(issueModal).should("not.exist");
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");

  cy.get(backlogList)
    .should("be.visible")
    .and("have.length", "1")
    .within(() => {
      cy.get(issuesList)
        .should("have.length", expectedAmountIssues)
        .first()
        .find("p")
        .contains(issueDetails.title);
    });
}

function openIssue(issueDetails) {
  cy.get(issuesList)
    .first()
    .trigger("mouseover")
    .should("contain", issueDetails.title)
    .click();
  cy.get(issueDetailModal).should("be.visible");
}

function closeDetailModal() {
  cy.get(closeButton).should("exist");
  cy.get(issueDetailModal).get(closeButton).first().click();
  cy.get(issueDetailModal).should("not.exist");
  cy.get(avatarLordGaben).should("be.visible");
}

function clickTimeTracking() {
  timeTracking().click();
  cy.get(timeTrackingModal).should("be.visible");
}

function logTime(timeSpent, timeRemaining) {
  if (timeSpent > 0) {
    timeSpentField().click().clear().type(timeSpent);
  } else {
    timeSpentField().click().clear();
  }
  if (timeRemaining > 0) {
    timeRemainingField().clear().type(timeRemaining);
  } else {
    timeRemainingField().clear();
  }
  cy.get(timeTrackingModal).within(() => {
    cy.contains(doneButtonName).click();
  });
}

function ensureTimeIsLogged(timeSpent, timeRemaining) {
  cy.get(issueDetailModal).within(() => {
    if (timeSpent > 0) {
      cy.contains(timeSpent + timeLoggedText).should("be.visible");
    } else {
      cy.contains(timeSpent + timeLoggedText).should("not.exist");
      checkNoTimeLogged();
    }
    if (timeRemaining > 0) {
      cy.contains(timeRemaining + timeRemainingText).should("be.visible");
    } else {
      cy.contains(timeRemaining + timeRemainingText).should("not.exist");
    }
  });
}

function estimationChanging(time) {
  if (time > 0) {
    timeEstimatedField().click().clear().type(time).blur();
    timeEstimatedField().trigger("mouseover");
  } else {
    timeEstimatedField().click().clear().blur();
  }
}

function ensureEstimationIsLogged(timeEstimated) {
  cy.get(issueDetailModal).within(() => {
    if (timeEstimated > 0) {
      cy.contains(timeEstimated + estimatedTimeText).should("be.visible");
    } else {
      cy.contains(timeEstimated + estimatedTimeText).should("not.exist");
      timeEstimatedField().should("have.attr", "placeholder", "Number");
    }
  });
}

function checkNoTimeLogged() {
  timeTracking().should("contain", "No time logged");
}

function reOpenIssue(issueDetails) {
  closeDetailModal();
  openIssue(issueDetails);
}
