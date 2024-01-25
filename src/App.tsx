import Logo from '@/components/Logo'
import PersonsTable from '@/components/PersonsTable'

import useDataParser from '@/hooks/useDataParser'

function App() {
  const { persons } = useDataParser()

  return (
    <>
      <nav className="flex items-center gap-4 p-4 align-middle">
        <Logo />
      </nav>
      <main className="max-w-[800px]">
        <span className="block h-4" />
        <PersonsTable persons={persons} />
      </main>
    </>
  )
}

export default App
