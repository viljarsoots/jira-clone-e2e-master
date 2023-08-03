describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
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

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  const expectedLength = 5;
  let arrayOfPriorities = [];

  // Assignment 3: Task 1 (BONUS)

  it('Should validate values and the array length and type out the Values.', () => {
    const prioritySelector = '[data-testid="select:priority"]';
    getIssueDetailsModal().within(() => {
      cy.get(prioritySelector).then(($value) => {
        cy.log('Selected option ' + $value.text().trim());
        arrayOfPriorities.push($value.text().trim());
      });
      cy.get(prioritySelector).click()
        .next()
        .find('[data-testid*="select-option:"]')
        .each(($option) => {
          arrayOfPriorities.push($option.text().trim());
          cy.log('Added option: ' + $option.text().trim(), 'Array length: ' + arrayOfPriorities.length);
        }).then(() => {
          cy.wrap(arrayOfPriorities).should('have.lengthOf', expectedLength);
        });
    });
  });

  // Assignment 3: Task 2 (BONUS)

  it('Check if the reporter name has only characters in it', () => {
    const pattern = /^[A-Za-z\s]*$/;

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:reporter"]')
        .find('[data-testid*="avatar:"]')
        .next()
        .invoke('text').should('match', pattern)
    });
  });


});


