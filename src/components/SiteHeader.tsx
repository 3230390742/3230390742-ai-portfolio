import { Download, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PortfolioData } from '../content/types'
import styles from './SiteHeader.module.css'

export function SiteHeader({ person }: { person: PortfolioData['person'] }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const links = [
    ['重点项目', '#featured-work'],
    ['其他项目', '#more-work'],
    ['关于', '#about'],
    ['联系', '#contact'],
  ] as const

  return (
    <header className={`${styles.header} ${scrolled ? styles.compact : ''}`}>
      <a className={styles.brand} href="#main-content" aria-label="返回页面顶部">{person.name}</a>
      <button className={styles.menuButton} type="button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen((value) => !value)}>
        <span className="srOnly">{open ? '关闭导航' : '打开导航'}</span>
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav id="site-navigation" aria-label="主要导航" className={open ? styles.navigationOpen : styles.navigation}>
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className={styles.resume} href={person.resumeUrl} download>简历 <Download aria-hidden="true" /></a>
      </nav>
    </header>
  )
}
