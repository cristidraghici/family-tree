import TreePNG from '@/assets/tree.svg'

const Logo = () => {
  return (
    <div className="Logo">
      <h1>Family tree</h1>
      <a href="https://cristidraghici.github.io/family-tree/">
        <img src={TreePNG} alt="Family tree" width={44} />
      </a>
    </div>
  )
}

export default Logo
