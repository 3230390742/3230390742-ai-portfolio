import { Hero } from './components/Hero'
import { FeaturedCaseStudy } from './components/FeaturedCaseStudy'
import { SiteHeader } from './components/SiteHeader'
import { portfolioData } from './content/portfolio'

export default function App() {
  return (
    <>
      <a className="skipLink" href="#main-content">跳到主要内容</a>
      <SiteHeader person={portfolioData.person} />
      <main id="main-content">
        <Hero person={portfolioData.person} metrics={portfolioData.heroMetrics} />
        <section id="featured-work" aria-labelledby="featured-heading">
          <h2 className="srOnly" id="featured-heading">重点项目</h2>
          {portfolioData.featuredProjects.map((project, index) => (
            <FeaturedCaseStudy key={project.id} project={project} index={index} />
          ))}
        </section>
      </main>
    </>
  )
}
