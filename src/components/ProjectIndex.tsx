import type { CompactProject } from '../content/types'
import styles from './ProjectIndex.module.css'

export function ProjectIndex({ projects }: { projects: CompactProject[] }) {
  return (
    <section className={styles.section} id="more-work" aria-labelledby="more-work-heading">
      <div className={styles.title}>
        <p>04—06 / SELECTED</p>
        <h2 id="more-work-heading">其他项目</h2>
      </div>
      <div className={styles.list}>
        {projects.map((project, index) => (
          <article data-testid="compact-project" key={project.id}>
            <span>{String(index + 4).padStart(2, '0')}</span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <small>{project.role}</small>
            </div>
            <div>
              <p>{project.result}</p>
              <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
