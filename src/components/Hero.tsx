import { ArrowDownRight, Download } from 'lucide-react'
import type { Metric, PortfolioData } from '../content/types'
import styles from './Hero.module.css'

type HeroProps = {
  person: PortfolioData['person']
  metrics: Metric[]
}

export function Hero({ person, metrics }: HeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <p className={styles.identity}>{person.name}</p>
      <p className={styles.eyebrow}>AI APPLICATION ENGINEER · RAG · AGENT</p>
      <h1 id="hero-title">{person.headline}</h1>
      <p className={styles.introduction}>{person.introduction}</p>
      <div className={styles.actions}>
        <a className={styles.primary} href="#featured-work">查看重点项目 <ArrowDownRight aria-hidden="true" /></a>
        <a className={styles.secondary} href={person.resumeUrl} download>下载中文简历 <Download aria-hidden="true" /></a>
      </div>
      <dl className={styles.metrics} aria-label="代表成果">
        {metrics.map((metric) => (
          <div className={styles.metricCard} data-testid="hero-metric" key={metric.label}>
            <dt>{metric.label}</dt>
            <dd>{metric.value}</dd>
            <dd className={styles.metricSource}>{metric.source}</dd>
            <dd className={styles.metricNote}>{metric.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
