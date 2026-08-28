import { Download, ExternalLink } from 'lucide-react'
import type { PortfolioData } from '../content/types'
import styles from './AboutContact.module.css'

export function AboutContact({ data }: { data: PortfolioData }) {
  return <>
    <section className={styles.about} id="about" aria-labelledby="about-heading">
      <div>
        <p className={styles.kicker}>ABOUT / CAPABILITIES</p>
        <h2 id="about-heading">研究复杂问题，交付可用系统。</h2>
        <p className={styles.copy}>{data.about}</p>
      </div>
      <div className={styles.skills}>
        {data.skillGroups.map((group) => (
          <section key={group.label}>
            <h3>{group.label}</h3>
            <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ))}
      </div>
    </section>
    <section className={styles.contact} id="contact" aria-labelledby="contact-heading">
      <p className={styles.kicker}>OPEN TO AI APPLICATION INTERNSHIPS</p>
      <h2 id="contact-heading">一起把 AI 做成真正可用的产品。</h2>
      <div className={styles.actions}>
        <a href={data.person.githubUrl} target="_blank" rel="noreferrer">访问 GitHub <ExternalLink aria-hidden="true" /></a>
        <a href={data.person.resumeUrl} download>下载中文简历 <Download aria-hidden="true" /></a>
      </div>
    </section>
  </>
}
