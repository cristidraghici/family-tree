describe('base', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the app', () => {
    const APP_TITLE = 'Family tree'
    cy.contains(APP_TITLE)
  })

  it('searches for a person', () => {
    const PERSON_NAME = 'Josephine Baden'

    cy.get('input[type="search"]').type(PERSON_NAME)

    cy.get('article').contains(PERSON_NAME)
  })

  it('clicks on a person', () => {
    const PERSON_FIRST_NAME = 'Josephine'
    const PERSON_LAST_NAME = 'Baden'
    const CANCEL_BUTTON_TEXT = 'Cancel'

    cy.get('input[type="search"]').type(`${PERSON_FIRST_NAME} ${PERSON_LAST_NAME}`)

    cy.get('article').contains(PERSON_FIRST_NAME).click()
    cy.get('dialog').should('be.visible')

    cy.get('dialog').within(() => {
      cy.findByText(CANCEL_BUTTON_TEXT).click()
    })
  })

  it('shows the graph', () => {
    const GRAPH_BUTTON_TEXT = 'Graph'

    cy.get('button').contains(GRAPH_BUTTON_TEXT).click()

    cy.get('canvas').should('be.visible')
  })
})
