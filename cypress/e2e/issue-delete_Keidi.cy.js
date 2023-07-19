describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      //Find and open first issue from Backlog list
      cy.get('[data-testid="board-list:backlog')
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  //Task 1 - deleting the issue

  it('Delete an issue', () => {

    //Assert that issue detail view modal is visible
    cy.get('[data-testid="modal:issue-details"]').should('be.visible')

    //Find delete icon and click on it
    cy.get('[data-testid="icon:trash"]').click()

    //Make sure a confirmation window appears and click on "Delete Issue"
    cy.get('[data-testid="modal:confirm"]').contains('Delete issue').click()

    //Assert that deletion confirmation dialogue does not exist after
    cy.get('[data-testid="modal:confirm"]').should('not.exist')

    //Assert that Backlog list does not have deleted issue
    cy.get('[data-testid="board-list:backlog').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('not.have.text', 'This is an issue of type: Task.')
    });
  });
});


// Task 2


describe('Cancelling the issue deletion process', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      //Find and open first issue from Backlog list
      cy.get('[data-testid="board-list:backlog')
      cy.contains('You can use rich text with images in issue descriptions.').click();
    });
  });

  it('should cancel the issue deletion', () => {
    //Assert that issue detail view modal is visible
    cy.get('[data-testid="modal:issue-details"]').should('be.visible')

    //Find delete icon and click on it
    cy.get('[data-testid="icon:trash"]').click()

    //Cancel the deletion in the confirmation pop-up
    cy.get('[data-testid="modal:confirm"]').contains('Cancel').click()

    //Assert that deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist')

    //Leave the issue detail view
    cy.get('[data-testid="icon:close"]').eq(0).click()

    //Assert that issue is not deleted and still displayed on the Jira board
    cy.get('[data-testid="board-list:backlog').within(() => {
      cy.get('[data-testid="list-issue"]').eq(3)
        .should('have.text', 'You can use rich text with images in issue descriptions.')

    });
  });

});
