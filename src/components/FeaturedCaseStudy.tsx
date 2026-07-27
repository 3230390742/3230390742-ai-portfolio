import { useState } from 'react'
import type { CaseVisual, FeaturedProject } from '../content/types'
import styles from './FeaturedCaseStudy.module.css'

type OpenableVisual = Extract<CaseVisual, { kind: 'image' | 'video' }>

function ProjectThumbnail({ visual }: { visual: OpenableVisual }) {
  const [failed, setFailed] = useState(false)
  const label = visual.kind === 'image' ? visual.caption : visual.title

  if (failed) {
    return (
      <div className={styles.mediaFallback} role="img" aria-label={`${label}加载失败`}>
        <strong>{label}</strong>
        <span>媒体暂不可用</span>
      </div>
    )
  }

  return (
    <img
      src={visual.kind === 'image' ? visual.src : visual.poster}
      alt={visual.kind === 'image' ? visual.alt : ''}
      width="1440"
      height="900"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

type FeaturedCaseStudyProps = {
  project: FeaturedProject
  index: number
  onOpenMedia?: (project: FeaturedProject, visualIndex: number, trigger: HTMLButtonElement) => void
}

export function FeaturedCaseStudy({ project, index, onOpenMedia }: FeaturedCaseStudyProps) {
  return (
    <article className={styles.caseStudy} aria-labelledby={`${project.id}-title`}>
      <div className={styles.heading}>
        <p className={styles.number}>{String(index + 1).padStart(2, '0')} / FEATURED</p>
        <div>
          <p className={styles.status}>{project.status}</p>
          <h3 id={`${project.id}-title`}>{project.title}</h3>
        </div>
        <div className={styles.meta}>
          <span>{project.period}</span>
          <span>{project.role}</span>
        </div>
      </div>
      <p className={styles.summary}>{project.summary}</p>
      <div className={styles.visuals}>
        {project.visuals.map((visual, visualIndex) => {
          if (visual.kind === 'evidence') {
            return (
              <figure className={styles.evidence} aria-label={visual.title} key={visual.title}>
                <figcaption>{visual.title}</figcaption>
                <ol>
                  {visual.lines.map((line) => <li key={line}>{line}</li>)}
                </ol>
              </figure>
            )
          }

          const label = visual.kind === 'image' ? visual.caption : visual.title
          return (
            <button
              className={styles.mediaButton}
              type="button"
              aria-label={`查看：${label}`}
              key={visual.src}
              onClick={(event) => onOpenMedia?.(project, visualIndex, event.currentTarget)}
            >
              <ProjectThumbnail visual={visual} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
      <div className={styles.narrative}>
        <section>
          <h4>问题</h4>
          <p>{project.problem}</p>
          <h4>约束</h4>
          <ul>{project.constraints.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section>
          <h4>关键决策</h4>
          <ul>{project.decisions.map((item) => <li key={item}>{item}</li>)}</ul>
          <h4>实现</h4>
          <ul>{project.implementation.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>
      <dl className={styles.results}>
        {project.results.map((result) => (
          <div key={result.label}>
            <dt>{result.label}</dt>
            <dd>{result.value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.footer}>
        <ul aria-label="技术栈">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
        <p>{`证据：${project.evidence.join(' · ')}`}</p>
      </div>
    </article>
  )
}
