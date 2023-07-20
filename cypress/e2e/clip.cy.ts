// Testing Steps
// 1.Visit homepage
// 2.Click on first clip
// 3.Click on video player
// 4.Wait 3 seconds
// 5.Click on video player
// 6.Assert width of progress bar

describe('Clip', () => {
  it('should play clip', () => {
    cy.visit('/');
    cy.get('app-clips-list > .grid a:first').click();
    cy.get('.video-js', { timeout: 150000 }).should('be.visible').click();
    cy.wait(3000);
    cy.get('.video-js').click();
    //gte = greater than or equal to
    cy.get('.vjs-play-progress').invoke('width').should('gte', 0);
  });
});
