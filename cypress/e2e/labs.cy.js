import { register } from './helpers';

function addLab(subject, title, deadline) {
  cy.get('[data-cy=add-lab]').click();
  cy.get('[data-cy=subject]').type(subject);
  cy.get('[data-cy=number]').type('1');
  cy.get('[data-cy=title]').type(title);
  cy.get('[data-cy=deadline]').type(deadline);
  cy.get('[data-cy=save]').click();
}

describe('Лабораторні роботи', () => {
  beforeEach(() => {
    register();
  });

  it('додає лабораторну до списку', () => {
    addLab('Веб-технології', 'Ідея та мокапи', '2030-01-15');
    cy.get('[data-cy=lab-row]').should('have.length', 1).and('contain', 'Веб-технології');
  });

  it('зберігає лабораторні на сервері після перезавантаження', () => {
    addLab('Алгоритми', 'Сортування', '2030-01-15');
    cy.reload();
    cy.get('[data-cy=lab-row]').should('have.length', 1);
  });

  it('змінює статус і оновлює прогрес семестру', () => {
    addLab('Алгоритми', 'Сортування', '2030-01-15');
    cy.get('[data-cy=status-select]').select('Захищено');
    cy.get('[data-cy=progress-text]').should('contain', '1 з 1 захищено');
  });

  it('редагує лабораторну, і форма не порожніє після перезавантаження', () => {
    addLab('Алгоритми', 'Сортування', '2030-01-15');
    cy.get('[data-cy=edit-lab]').click();
    cy.reload();
    cy.get('[data-cy=subject]').should('have.value', 'Алгоритми');
    cy.get('[data-cy=title]').clear();
    cy.get('[data-cy=title]').type('Швидке сортування');
    cy.get('[data-cy=save]').click();
    cy.get('[data-cy=lab-row]').should('contain', 'Швидке сортування');
  });

  it('видаляє лабораторну', () => {
    addLab('Алгоритми', 'Сортування', '2030-01-15');
    cy.get('[data-cy=remove-lab]').click();
    cy.get('[data-cy=empty]').should('exist');
  });
});
