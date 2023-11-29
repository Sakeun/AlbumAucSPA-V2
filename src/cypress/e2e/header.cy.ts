/// <reference types='cypress'/> 

context("header", () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
    })

    it('Header should include logo', () => {
        cy.get('.header-image__img').should('be.visible');
    })

    it('Header should have menu', () => {
        cy.get('.menu > :nth-child(2)').click();
    })

    it('Header should change login/register to profile/signout', () => {
        cy.get('[href="/login"]').should('have.text', 'Login');
        cy.get('[href="/register"]').should('have.text', 'Register');
        cy.get('[href="/login"]').click();
        cy.get('[type="text"]').type('test@t.nl');
        cy.get('[type="password"]').clear();
        cy.get('[type="password"]').type('1234');
        cy.get('button').click();
        cy.get('[href="/profile"]').should('have.text', 'Profile');
        cy.get('.menu > :nth-child(6)').should('have.text', 'Sign out');
    })

    it('Signout should change header', () => {
    })
})

export {}