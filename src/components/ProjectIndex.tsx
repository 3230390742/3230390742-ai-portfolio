import type { CompactProject } from '../content/types'
import styles from './ProjectIndex.module.css'

export function ProjectIndex({ projects }: { projects: CompactProject[] }) {
  const startNumber = 5
  const endNumber = projects.length + 4

  return (
    <section className={styles.section} id="more-work" aria-labelledby="more-work-heading">
      <div className={styles.title}>
        <p>{`${String(startNumber).padStart(2, '0')}—${String(endNumber).padStart(2, '0')} / SELECTED`}</p>
        <h2 id="more-work-heading">其他项目</h2>
      </div>
      <div className={styles.list}>
        {projects.map((project, index) => (
          <article data-testid="compact-project" key={project.id}>
            <span>{String(index + startNumber).padStart(2, '0')}</span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <small>{project.role}</small>
            </div>
            <div className={styles.resultBlock}>
              <p>{project.result}</p>
              <p className={styles.resultSource}>{project.resultSource}</p>
              <p className={styles.resultNote}>{project.resultNote}</p>
              <p className={styles.projectSource}>{project.source}</p>
              <p className={styles.projectNote}>{project.verificationNote}</p>
              <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
