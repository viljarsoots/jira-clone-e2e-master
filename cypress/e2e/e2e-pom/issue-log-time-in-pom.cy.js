
import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', 'https://jira.ivorreic.com/project').then((url) => {  
    cy.contains(issueTitle).click();
    });
  });

  const issueTitle = 'This is an issue of type: Task.';
  let timeSpent = 1;

  it.only('Should log time successfully', () => {
    
    IssueModal.clickTimeTracking();
    IssueModal.logTime(timeSpent);
    
  });

  it('Should cancel deletion process successfully', () => {
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
  });
});
