import { useState } from 'react'
import Logo from '@/components/atoms/Logo'

import ConditionalElement from '@/components/atoms/ConditionalElement'

import PersonsTable from '@/components/molecules/PersonsTable'
import FamilyTree from '@/components/molecules/FamilyTree'
import CardList from '@/components/molecules/CardList'

import useDataParser from '@/hooks/useDataParser'

function App() {
  const { persons } = useDataParser()
  const [view, setView] = useState<string>('table')

  return (
    <>
      <nav className="Nav">
        <Logo />
      </nav>

      <div className="Spacer" />

      <main className="Main container-fluid">
        <div className="Controls Controls--horizontal">
          <fieldset className="Controls_ToggleView" role="group">
            <button
              className={view === 'table' ? 'outline' : ''}
              onClick={() => {
                setView('table')
              }}
              type="button"
            >
              Table
            </button>
            <button
              className={view === 'tree' ? 'outline' : ''}
              onClick={() => {
                setView('tree')
              }}
              type="button"
            >
              Tree
            </button>
            <button
              className={view === 'cards' ? 'outline' : ''}
              onClick={() => {
                setView('cards')
              }}
              type="button"
              role="primary"
            >
              Cards
            </button>
          </fieldset>

          <fieldset role="group">
            <input className="Search" type="text" />
            <input type="submit" value="Search" />
          </fieldset>

          <fieldset className="Controls_AddButton" role="group">
            <button type="button">Add</button>
          </fieldset>
        </div>

        <div className="Spacer" />

        <ConditionalElement condition={view === 'table'} as={PersonsTable} persons={persons} />
        <ConditionalElement condition={view === 'tree'} as={FamilyTree} />
        <ConditionalElement condition={view === 'cards'} as={CardList} />

        <div className="Spacer" />
      </main>
    </>
  )
}

export default App
