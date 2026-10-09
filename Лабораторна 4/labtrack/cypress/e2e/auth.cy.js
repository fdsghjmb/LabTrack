describe('Авторизація', () => {
  it('перенаправляє неавторизованого користувача на сторінку входу', () => {
    cy.visit('/labs');
    cy.url().should('include', '/login');
  });

  it('реєструє нового користувача й пускає до списку робіт', () => {
    cy.visit('/login');
    cy.get('[data-cy=tab-register]').click();
    cy.get('[data-cy=name]').type('Іван');
    cy.get('[data-cy=email]').type('ivan@uzhnu.edu.ua');
    cy.get('[data-cy=password]').type('secret123');
    cy.get('[data-cy=submit]').click();
    cy.url().should('include', '/labs');
    cy.get('[data-cy=user-name]').should('have.text', 'Іван');
  });

  it('показує помилку при невірному паролі', () => {
    cy.visit('/login');
    cy.get('[data-cy=email]').type('nobody@uzhnu.edu.ua');
    cy.get('[data-cy=password]').type('wrong-pass');
    cy.get('[data-cy=submit]').click();
    cy.get('[data-cy=auth-error]').should('contain', 'Невірна пошта або пароль');
  });

  it('виходить із системи', () => {
    cy.visit('/login');
    cy.get('[data-cy=tab-register]').click();
    cy.get('[data-cy=name]').type('Іван');
    cy.get('[data-cy=email]').type('ivan@uzhnu.edu.ua');
    cy.get('[data-cy=password]').type('secret123');
    cy.get('[data-cy=submit]').click();
    cy.get('[data-cy=logout]').click();
    cy.url().should('include', '/login');
  });
});
