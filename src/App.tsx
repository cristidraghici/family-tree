import { useState } from 'react'
import { Button } from '@/components/ui/button'

import TREE_IMAGE from '/tree-16px.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav>
        <div className="flex gap-4 p-4 align-middle">
          <h1>Family tree</h1>
          <a href="https://cristidraghici.github.com/family-tree" target="_blank">
            <img src={TREE_IMAGE} className="logo" alt="App logo" />
          </a>
        </div>
      </nav>
      <main className="max-w-[800px] p-10">
        <p className="bg-gray-50 p-4 text-black">
          Genealogy is a journey, and it often involves uncovering fascinating stories about your
          ancestors. This application tries to help you enjoy the process! :)
        </p>

        <Button className="mt-4" onClick={() => setCount((count) => count + 1)}>
          Click count is {count}
        </Button>
      </main>
    </>
  )
}

export default App
