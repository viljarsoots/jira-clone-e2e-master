
describe('Issue deleting', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.get('[data-testid="list-issue"]')
        .should("be.visible")
        .first()
        //Saving the issue name for assertation at the end of the tests
        .then(($span) => {
          taskName = $span.text();
        })
        .click();
      getIssueDetailsModal()
        .should("be.visible")
    });

  });

  it('Should delete first issue from the list', () => {
    getIssueDetailsModal()
      .find('[data-testid="icon:trash"]')
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains('button', 'Delete issue')
      .click()
      .should("not.exist");

    cy.reload();
    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        //Assert that First Issue from the list is deleted.
        cy.get('[data-testid="list-issue"]')
          .first('not.contain', taskName);

      });

  });

  it('Should cancel the delete first issue from the list process', () => {
    getIssueDetailsModal()
      .find('[data-testid="icon:trash"]')
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains('button', 'Cancel')
      .click()
      .should("not.exist");

    cy.get('[data-testid="icon:close"]')
      .first()
      .click()

    cy.reload();
    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        //Assert that First Issue from the list is not deleted.
        cy.get('[data-testid="list-issue"]')
          .first('contain', taskName);

      });

  });
  let taskName
  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

});