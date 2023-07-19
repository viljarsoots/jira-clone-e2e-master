describe('Issue deletion process', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
    // Assertion that issue detail view is visible
    cy.get('[data-testid="modal:issue-details"]').should('be.visible')
  });


  it('Check that issue can be deleted', () => {
    // Issue is on the screen and delete (trash icon) button can be pressed
    cy.get('[data-testid="icon:trash"]').click();

    // Assert that deletion confirmation is visible and click on "Delete issue"
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[class="sc-bxivhb rljZq"]').contains('Delete issue').click();

    // Assert that deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');

    // Assert that issue is deleted and not displayed on the Jira board
    cy.reload();
    cy.get('[class="sc-kPVwWT eYJELZ"]').contains('This is an issue of type: Task.').should('not.exist');
  });

  it('Check that issue deletion process can be cancelled', () => {
    // Issue is on the screen and delete (trash icon) button can be pressed
    cy.get('[data-testid="icon:trash"]').click();

    // Assert that deletion confirmation is visible and click on "Cancel"
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[class="sc-bwzfXH ewzfNn sc-kGXeez bLOzZQ"]').contains('Cancel').click();

    // Assert that deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');

    // Assert that issue is not deleted and is still displayed on the Jira board
    cy.reload();
    cy.get('[class="sc-kPVwWT eYJELZ"]').contains('This is an issue of type: Task.').should('exist');
  });
});