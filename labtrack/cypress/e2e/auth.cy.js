import { register, uniqueEmail } from './helpers';

describe('Авторизація', () => {
  it('перенаправляє неавторизованого користувача на сторінку входу', () => {
    cy.visit('/labs');
    cy.url().should('include', '/login');
  });

  it('реєструє нового користувача й пускає до списку робіт', () => {
    register();
    cy.get('[data-cy=user-name]').should('have.text', 'Іван');
  });

  it('показує помилку при невірному паролі', () => {
    cy.visit('/login');
    cy.get('[data-cy=email]').type(uniqueEmail());
    cy.get('[data-cy=password]').type('wrong-pass');
    cy.get('[data-cy=submit]').click();
    cy.get('[data-cy=auth-error]').should('contain', 'Невірна пошта або пароль');
  });

  it('не дає зареєструвати ту саму пошту двічі', () => {
    const email = register();
    cy.get('[data-cy=logout]').click();
    cy.get('[data-cy=tab-register]').click();
    cy.get('[data-cy=name]').type('Іван');
    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=password]').type('secret123');
    cy.get('[data-cy=submit]').click();
    cy.get('[data-cy=auth-error]').should('contain', 'вже існує');
  });

  it('входить повторно після виходу', () => {
    const email = register();
    cy.get('[data-cy=logout]').click();
    cy.url().should('include', '/login');
    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=password]').type('secret123');
    cy.get('[data-cy=submit]').click();
    cy.url().should('include', '/labs');
  });

  it('зберігає сесію після перезавантаження сторінки', () => {
    register();
    cy.reload();
    cy.get('[data-cy=user-name]').should('have.text', 'Іван');
  });
});
