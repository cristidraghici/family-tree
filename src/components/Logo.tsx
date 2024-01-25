import TREE_IMAGE from '/tree-16px.png'

const Logo = () => {
  return (
    <div className="flex gap-4 align-middle">
      <h1>Family tree</h1>
      <a href="https://cristidraghici.github.io/family-tree/" target="_blank">
        <img src={TREE_IMAGE} className="logo" alt="App logo" />
      </a>
    </div>
  )
}

export default Logo
