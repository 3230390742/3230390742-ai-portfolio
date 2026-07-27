import type { PortfolioData } from '../content/types'

export function SiteFooter({ person }: { person: PortfolioData['person'] }) {
  return <footer style={{ padding: '28px max(24px, calc((100vw - var(--max-width)) / 2))', background: 'var(--ink)', color: '#dbe5df', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 12 }}><span>© 2026 {person.name}</span><span>React · Vite · TypeScript</span></footer>
}
