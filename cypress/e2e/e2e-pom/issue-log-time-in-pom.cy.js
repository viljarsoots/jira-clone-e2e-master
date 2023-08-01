
import IssueModal from "../../pages/IssueModal";


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
  

describe('Log time', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', 'https://jira.ivorreic.com/project').then((url) => {
    //open isse creation modal  
    cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  

  it('Should log time successfully', () => {
    cy.log('New Issue Is created');
    IssueModal.createIssue(issueDetails);
    IssueModal.ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);
    cy.log('Time estimation is added');
    IssueModal.openIssue(issueDetails);
    IssueModal.estimationChanging(issueDetails.timeEstimated);
    IssueModal.closeDetailModal();
    cy.wait(2000);
    IssueModal.openIssue(issueDetails);
    IssueModal.ensureEstimationIsLogged(issueDetails.timeEstimated);
    cy.log('Time estimation is edited');
    IssueModal.estimationChanging(issueDetails.newEstimation);
    IssueModal.closeDetailModal();
    cy.wait(2000);
    IssueModal.openIssue(issueDetails);
    IssueModal.ensureEstimationIsLogged(issueDetails.newEstimation);
    cy.log('Time estimation is removed');
    IssueModal.estimationChanging(issueDetails.estimationDeleted);
    IssueModal.closeDetailModal();
    cy.wait(2000);
    IssueModal.openIssue(issueDetails);
    IssueModal.ensureEstimationIsLogged(issueDetails.estimationDeleted);
    IssueModal.clickTimeTracking();
    IssueModal.logTime(issueDetails);
    IssueModal.ensureTimeIsLogged(issueDetails);
    IssueModal.closeDetailModal();
    IssueModal.openIssue(issueDetails);
    
    
    
  });

  
});


