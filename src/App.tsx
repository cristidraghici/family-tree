import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="max-w-[800px] p-10">
      <div className="flex items-center gap-2 p-4 align-middle">
        <h1>Family tree</h1>
        <a href="https://cristidraghici.github.com/family-tree" target="_blank">
          <img src="/tree-16px.png" className="logo" alt="App logo" />
        </a>
      </div>

      <p className="bg-gray-50 p-4 text-black">
        Genealogy is a journey, and it often involves uncovering fascinating stories about your
        ancestors. This application tries to help you enjoy the process! :)
      </p>

      <button className="p-4" onClick={() => setCount((count) => count + 1)}>
        Click count is {count}
      </button>
    </div>
  )
}

export default App
