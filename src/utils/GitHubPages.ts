
class GitHubPages {
  restore() {
    const l = window.location
    if (!l.hostname.includes('github.io')) {
      return
    }

    if (l.search) {
      const q: Record<string, string> = {}
      l.search
        .slice(1)
        .split('&')
        .forEach((v) => {
          const a = v.split('=')
          q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&')
        })
      if (q.p !== undefined) {
        window.history.replaceState(
          null,
          '',
          l.pathname.slice(0, -1) + (q.p || '') + (q.q ? '?' + q.q : '') + l.hash,
        )
      }
    }
  }
}

export default new GitHubPages()
