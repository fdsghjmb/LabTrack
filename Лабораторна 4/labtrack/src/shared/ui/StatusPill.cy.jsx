import StatusPill, { STATUSES } from './StatusPill';

describe('StatusPill', () => {
  Object.entries(STATUSES).forEach(([key, label]) => {
    it(`показує підпис «${label}» для статусу ${key}`, () => {
      cy.mount(<StatusPill status={key} />);
      cy.get('[data-cy=status-pill]').should('have.text', label);
      cy.get('[data-cy=status-pill]').should('have.class', `status-${key}`);
    });
  });
});
