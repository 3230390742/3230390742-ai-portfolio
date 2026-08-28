import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { agentReplay } from '../content/agentReplay'
import type { CaseVisual, FeaturedProject } from '../content/types'
import { AgentMcpReplay } from './AgentMcpReplay'
import styles from './FeaturedCaseStudy.module.css'

type OpenableVisual = Extract<CaseVisual, { kind: 'image' | 'video' }>

function ProjectThumbnail({ visual, priority }: { visual: OpenableVisual; priority: boolean }) {
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
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
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
    <article className={styles.caseStudy} id={project.id} data-project={project.id} aria-labelledby={`${project.id}-title`}>
      <div className={styles.heading}>
        <p className={styles.number}>{String(index + 1).padStart(2, '0')} / FEATURED</p>
        <div>
          <div className={styles.statusRow}>
            <p className={styles.status}>{project.status}</p>
            <p className={styles.statusEvidence}>{project.verification.source}</p>
          </div>
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

          if (visual.kind === 'agent-replay') {
            return <AgentMcpReplay key={visual.title} replay={agentReplay} />
          }

          const label = visual.kind === 'image' ? visual.caption : visual.title
          return (
            <button
              className={styles.mediaButton}
              type="button"
              aria-label={`查看：${label}`}
              key={`${visual.kind}:${visual.kind === 'image' ? visual.src : visual.poster}:${visualIndex}`}
              onClick={(event) => onOpenMedia?.(project, visualIndex, event.currentTarget)}
            >
              <ProjectThumbnail visual={visual} priority={index === 0 && visualIndex === 0} />
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
          <div className={styles.resultCard} key={result.label}>
            <dt>
              <span>{result.label}</span>
              <span className={styles.resultSource}>{result.source}</span>
            </dt>
            <dd>{result.value}</dd>
            <dd className={styles.resultNote}>{result.note}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.footer}>
        <ul aria-label="技术栈">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className={styles.footerAside}>
          <p>{`证据：${project.evidence.join(' · ')}`}</p>
          <p className={styles.verificationDetail}>
            <span>运行状态</span>
            {project.verification.runtimeStatus}
          </p>
          <p className={styles.verificationDetail}>
            <span>公开边界</span>
            {project.verification.publicBoundary}
          </p>
          {project.repositoryUrl && (
            <a
              className={styles.sourceLink}
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
            >
              查看源码 <ExternalLink aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
