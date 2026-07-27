import { useState } from 'react'
import { Hero } from './components/Hero'
import { FeaturedCaseStudy } from './components/FeaturedCaseStudy'
import { MediaViewer } from './components/MediaViewer'
import { ProjectIndex } from './components/ProjectIndex'
import { AboutContact } from './components/AboutContact'
import { SiteHeader } from './components/SiteHeader'
import { SiteFooter } from './components/SiteFooter'
import { portfolioData } from './content/portfolio'
import type { FeaturedProject } from './content/types'

type MediaSelection = { project: FeaturedProject; visualIndex: number; trigger: HTMLButtonElement } | null

export default function App() {
  const [selection, setSelection] = useState<MediaSelection>(null)

  const closeViewer = () => {
    const trigger = selection?.trigger
    setSelection(null)
    window.requestAnimationFrame(() => trigger?.focus())
  }

  return (
    <>
      <a className="skipLink" href="#main-content">跳到主要内容</a>
      <SiteHeader person={portfolioData.person} />
      <main id="main-content">
        <Hero person={portfolioData.person} metrics={portfolioData.heroMetrics} />
        <section id="featured-work" aria-labelledby="featured-heading">
          <h2 className="srOnly" id="featured-heading">重点项目</h2>
          {portfolioData.featuredProjects.map((project, index) => (
            <FeaturedCaseStudy key={project.id} project={project} index={index} onOpenMedia={(project, visualIndex, trigger) => setSelection({ project, visualIndex, trigger })} />
          ))}
        </section>
        <ProjectIndex projects={portfolioData.compactProjects} />
        <AboutContact data={portfolioData} />
      </main>
      <SiteFooter person={portfolioData.person} />
      {selection && <MediaViewer project={selection.project} initialIndex={selection.visualIndex} onClose={closeViewer} />}
    </>
  )
}
