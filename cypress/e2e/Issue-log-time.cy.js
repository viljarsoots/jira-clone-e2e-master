
const issueDetails = {
    title: 'New Issue for Time logging',
    type: "Bug",
    timeSpent: 2,
    timeRemaining: 5,
    timeEstimated: 10,
    newEstimation: 20,
    estimationDeleted: '',
    timeSpentDeleted: '',
    timeRemainingDeleted: ''
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

    it('Creating new Issue and testing time estimation functionality', () => {
        cy.log('New Issue Is created');
        createIssue(issueDetails);
        ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);
        cy.log('Time estimation is added');
        openIssue(issueDetails);
        checkNoTimeLogged();
        estimationChanging(issueDetails.timeEstimated);
        reOpenIssue(issueDetails);
        ensureEstimationIsLogged(issueDetails.timeEstimated);
        cy.log('Time estimation is edited');
        estimationChanging(issueDetails.newEstimation);
        reOpenIssue(issueDetails);
        ensureEstimationIsLogged(issueDetails.newEstimation);
        cy.log('Time estimation is removed');
        estimationChanging(issueDetails.estimationDeleted);
        reOpenIssue(issueDetails);
        ensureEstimationIsLogged(issueDetails.estimationDeleted);

    });
    it('Creating new Issue and testing time Logging functionality', () => {
        cy.log('New Issue Is created');
        createIssue(issueDetails);
        ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);
        cy.log('Time estimation is added');
        openIssue(issueDetails);
        timeTracking().should('contain', 'No time logged');
        estimationChanging(issueDetails.timeEstimated);
        closeDetailModal();
        cy.log('Time Loging');
        openIssue(issueDetails);
        clickTimeTracking();
        logTime(issueDetails.timeSpent, issueDetails.timeRemaining);
        ensureTimeIsLogged(issueDetails.timeSpent, issueDetails.timeRemaining);
        closeDetailModal();
        cy.log('Removing logged time');
        openIssue(issueDetails);
        clickTimeTracking();
        logTime(issueDetails.timeSpentDeleted, issueDetails.timeRemainingDeleted);
        reOpenIssue(issueDetails);
        ensureTimeIsLogged(issueDetails.timeSpentDeleted, issueDetails.timeRemainingDeleted);
        ensureEstimationIsLogged(issueDetails.timeEstimated);
    });


});
// Since in IssueModal the creation of issue is faulty I made new function. So everybody who runs it should sucseed.
function createIssue(issueDetails) {
    cy.get(issueModal).within(() => {
        cy.get('[data-testid="select:type"]').click();
        cy.get('[data-testid="select-option:Bug"]').trigger("click");
        cy.get('input[name="title"]').trigger('mouseover').click().type(issueDetails.title);
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
        .trigger('mouseover')
        .should("contain", issueDetails.title)
        .click();
    cy.get(issueDetailModal).should("be.visible");
}

function closeDetailModal() {
    cy.get(closeButton).should('exist');
    cy.get(issueDetailModal).get(closeButton).first().click();
    cy.get(issueDetailModal).should("not.exist");
    cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");

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
            cy.contains(timeSpent + "h logged").should("be.visible");
        } else {
            cy.contains(timeSpent + "h logged").should("not.exist");
            checkNoTimeLogged();
        }
        if (timeRemaining > 0) {
            cy.contains(timeRemaining + "h remaining").should("be.visible");
        } else {
            cy.contains(timeRemaining + "h remaining").should("not.exist");
        }
    });
}


function estimationChanging(time) {
    if (time > 0) {
        timeEstimatedField().click().clear().type(time).blur();
        timeEstimatedField().trigger('mouseover');
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
            timeEstimatedField().should('have.attr', 'placeholder', 'Number');

        }
    });
}

function checkNoTimeLogged() {
    timeTracking().should('contain', 'No time logged');
}

function reOpenIssue(issueDetails) {
    closeDetailModal();
    openIssue(issueDetails);

}