import { Hero } from './components/Hero'
import { SiteHeader } from './components/SiteHeader'
import { portfolioData } from './content/portfolio'

export default function App() {
  return (
    <>
      <a className="skipLink" href="#main-content">跳到主要内容</a>
      <SiteHeader person={portfolioData.person} />
      <main id="main-content">
        <Hero person={portfolioData.person} metrics={portfolioData.heroMetrics} />
      </main>
    </>
  )
}
