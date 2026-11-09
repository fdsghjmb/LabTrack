// Кожен тест працює з власним користувачем, тому дані на сервері не перетинаються.
export function uniqueEmail() {
  return `user${Date.now()}${Math.floor(Math.random() * 1e6)}@uzhnu.edu.ua`;
}

export function register(email = uniqueEmail()) {
  cy.visit('/login');
  cy.get('[data-cy=tab-register]').click();
  cy.get('[data-cy=name]').type('Іван');
  cy.get('[data-cy=email]').type(email);
  cy.get('[data-cy=password]').type('secret123');
  cy.get('[data-cy=submit]').click();
  cy.url().should('include', '/labs');
  return email;
}
