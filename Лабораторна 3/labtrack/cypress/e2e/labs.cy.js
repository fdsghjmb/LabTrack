function register() {
  cy.visit('/login');
  cy.get('[data-cy=tab-register]').click();
  cy.get('[data-cy=name]').type('Іван');
  cy.get('[data-cy=email]').type('ivan@uzhnu.edu.ua');
  cy.get('[data-cy=password]').type('secret123');
  cy.get('[data-cy=submit]').click();
}

function addLab(subject, title, deadline) {
  cy.get('[data-cy=add-lab]').click();
  cy.get('[data-cy=subject]').type(subject);
  cy.get('[data-cy=number]').type('1');
  cy.get('[data-cy=title]').type(title);
  cy.get('[data-cy=deadline]').type(deadline);
  cy.get('[data-cy=save]').click();
}

describe('Лабораторні роботи', () => {
  beforeEach(register);

  it('додає лабораторну до списку', () => {
    addLab('Веб-технології', 'Ідея та мокапи', '2030-01-15');
    cy.get('[data-cy=lab-row]').should('have.length', 1).and('contain', 'Веб-технології');
  });

  it('змінює статус і оновлює прогрес семестру', () => {
    addLab('Алгоритми', 'Сортування', '2030-01-15');
    cy.get('[data-cy=status-select]').select('Захищено');
    cy.get('[data-cy=progress-text]').should('contain', '1 з 1 захищено');
  });

  it('видаляє лабораторну', () => {
    addLab('Алгоритми', 'Сортування', '2030-01-15');
    cy.get('[data-cy=remove-lab]').click();
    cy.get('[data-cy=empty]').should('exist');
  });
});
