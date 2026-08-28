import type { PortfolioData } from '../content/types'
import styles from './SiteFooter.module.css'

export function SiteFooter({ person }: { person: PortfolioData['person'] }) {
  return (
    <footer className={styles.footer}>
      <span>© 2026 {person.name}</span>
      <span>React · Vite · TypeScript</span>
    </footer>
  )
}
