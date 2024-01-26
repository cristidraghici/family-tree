import TreePNG from '/tree.png'

const Logo = () => {
  return (
    <div className="flex gap-4">
      <h1>Family tree</h1>
      <a href="https://cristidraghici.github.io/family-tree/" target="_blank">
        <img src={TreePNG} className="logo" alt="Family tree" width={44} />
      </a>
    </div>
  )
}

export default Logo
