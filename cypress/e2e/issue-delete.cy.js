
import { faker } from "@faker-js/faker";

describe('Issue deleting', () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", "https://jira.ivorreic.com/project")
      .then((url) => {
        //System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });

  });


  it.only('Will create a new issue and delete it', () => {
    getAddNewIssueModal().within(() => {
      let title = 'NewBug'
      fillFields(title);
      cy.get('button[type="submit"]').click();
    });
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");
    cy.reload();
    cy.get('[data-testid="list-issue"]')
      .first()
      .click();

    cy.get('[data-testid="icon:trash"]')
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains('button', 'Delete issue')
      .click();
    

  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });
  const getAddNewIssueModal = () => cy.get('[data-testid="modal:issue-create"]');
  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
});
function fillFields(title) {
  cy.get('[data-testid="select:type"]').click();
  cy.get('[data-testid="select-option:Bug"]').trigger("click");
  cy.get(".ql-editor").type("My bug description");
  cy.get('input[name="title"]').type(title);
  cy.get('[data-testid="form-field:reporterId"]').click();
  cy.get('[data-testid="select-option:Pickle Rick"]').click();
  cy.get('[data-testid="select:userIds"]').click();
  cy.get('[data-testid="select-option:Lord Gaben"]').click();
  cy.get('[data-testid="form-field:priority"]').click();
  cy.get('[data-testid="select-option:Highest"]').click();
}