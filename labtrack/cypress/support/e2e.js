// Кожен тест починає з чистого localStorage, тому тести не залежать один від одного.
beforeEach(() => {
  cy.clearLocalStorage();
});
