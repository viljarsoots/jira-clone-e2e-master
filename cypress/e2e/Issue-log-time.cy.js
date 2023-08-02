import IssueModal from "../pages/IssueModal";


const issueDetails = {
    title: 'New Issue for Time logging',
    type: "Bug",
    description: "TEST_DESCRIPTION",
    assignee: "Lord Gaben",
    timeSpent: 6,
    timeEstimated: 10,
    newEstimation: 20,
    estimationDeleted: ''
};
const EXPECTED_AMOUNT_OF_ISSUES = '5';
const issueModal = '[data-testid="modal:issue-create"]';
const issueDetailModal = '[data-testid="modal:issue-details"]';
const closeButton = '[data-testid="icon:close"]';
const timeTrackingModal = '[data-testid="modal:tracking"]';
const submitButton = 'button[type="submit"]';
const backlogList = '[data-testid="board-list:backlog"]';
const issuesList = '[data-testid="list-issue"]';
const doneButtonName = "Done";

const timeTracking = () => cy.get('[data-testid="icon:stopwatch"]').next();
const timeEstimatedField = () => cy.get('input[placeholder="Number"]').eq(0);
const timeSpentField = () => cy.get('input[placeholder="Number"]').eq(1);
const timeRemainingField = () => cy.get('input[placeholder="Number"]').eq(2);



describe('Log time', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', 'https://jira.ivorreic.com/project').then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
        });
    });

    it('Creating new Issue and testing time logging functionality', () => {
        cy.log('New Issue Is created');
        createIssue(issueDetails);
        ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);
        cy.log('Time estimation is added');
        openIssue(issueDetails);
        estimationChanging(issueDetails.timeEstimated);
        closeDetailModal();
        cy.wait(500);
        openIssue(issueDetails);
        ensureEstimationIsLogged(issueDetails.timeEstimated);
        cy.log('Time estimation is edited');
        estimationChanging(issueDetails.newEstimation);
        closeDetailModal();
        cy.wait(500);
        openIssue(issueDetails);
        ensureEstimationIsLogged(issueDetails.newEstimation);
        cy.log('Time estimation is removed');
        estimationChanging(issueDetails.estimationDeleted);
        closeDetailModal();
        cy.wait(500);
        openIssue(issueDetails);
        ensureEstimationIsLogged(issueDetails.estimationDeleted);
        clickTimeTracking();
        logTime(issueDetails);
        ensureTimeIsLogged(issueDetails);
        closeDetailModal();
        openIssue(issueDetails);

    });

});

function createIssue(issueDetails) {
    cy.get(issueModal).within(() => {
        cy.get('[data-testid="select:type"]').click();
        cy.get('[data-testid="select-option:Bug"]').trigger("click");
        cy.get('input[name="title"]').type(issueDetails.title);
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
      .should("contain", issueDetails.title)
      .click();
    cy.get(issueDetailModal).should("be.visible");
  }

  function closeDetailModal() {
    cy.get(issueDetailModal).get(closeButton).first().click();
    cy.get(issueDetailModal).should("not.exist");
  }

function clickTimeTracking() {
    timeTracking().click();
    cy.get(timeTrackingModal).should("be.visible");
}

function logTime(issueDetails) {
    timeSpentField().click().clear().type(issueDetails.timeSpent);
    cy.get(timeTrackingModal).within(() => {
      cy.contains(doneButtonName).click();
    });
  }
  function ensureTimeIsLogged(issueDetails) {
    cy.get(issueDetailModal).within(() => {
      cy.contains(issueDetails.timeSpent + "h logged").should("be.visible");
    });
  }


function estimationChanging(time) {
    if (time > 0) {
        timeEstimatedField().click().clear().type(time).blur();
    } else {
        timeEstimatedField().click().clear().blur();
    }
}

function ensureEstimationIsLogged(timeEstimated) {
    cy.get(issueDetailModal).within(() => {
        if (timeEstimated > 0) {
            cy.contains(timeEstimated + "h estimated").should("be.visible");
        } else {
            cy.contains(timeEstimated + "h estimated").should("not.exist");
            timeEstimatedField().should('have.attr', 'placeholder', 'Number')
        }
    });
}