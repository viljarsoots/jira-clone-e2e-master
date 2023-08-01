
import IssueModal from "../../pages/IssueModal";


const issueDetails = {
  title: 'New Issue for Time logging',
  type: "Bug",
  description: "TEST_DESCRIPTION",
  assignee: "Lord Gaben",
  timeSpent: 6,
  timeEstimated: 10,
  newEstimation: 20
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

  

  it.only('Should log time successfully', () => {
    cy.log('New Issue Is created');
    IssueModal.createIssue(issueDetails);
    IssueModal.ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);
    cy.log('Time estimation is added');
    IssueModal.openIssue(issueDetails);
    IssueModal.addEstimation(issueDetails.timeEstimated);
    IssueModal.closeDetailModal();
    IssueModal.openIssue(issueDetails);
    IssueModal.ensureEstimationIsLogged(issueDetails.timeEstimated);
    IssueModal.clickTimeTracking();
    IssueModal.logTime(issueDetails);
    IssueModal.ensureTimeIsLogged(issueDetails);
    IssueModal.closeDetailModal();
    IssueModal.openIssue(issueDetails);
    
    
    
  });

  
});


