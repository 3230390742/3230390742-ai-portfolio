export type ProjectStatus = 'Active' | 'Verified' | 'Audited'

export interface Metric {
  value: string
  label: string
}

export type CaseVisual =
  | { kind: 'image'; src: string; alt: string; caption: string }
  | { kind: 'video'; src: string; poster: string; title: string; caption: string }
  | { kind: 'evidence'; title: string; lines: string[] }

export interface FeaturedProject {
  id: string
  title: string
  status: ProjectStatus
  period: string
  role: string
  summary: string
  problem: string
  constraints: string[]
  decisions: string[]
  implementation: string[]
  results: Metric[]
  stack: string[]
  evidence: string[]
  visuals: CaseVisual[]
  repositoryUrl?: string
  demoUrl?: string
}

export interface CompactProject {
  id: string
  title: string
  period: string
  role: string
  summary: string
  result: string
  stack: string[]
}

export interface PortfolioData {
  person: {
    name: string
    role: string
    headline: string
    introduction: string
    email: string
    githubUrl: string
    resumeUrl: string
  }
  heroMetrics: Metric[]
  featuredProjects: FeaturedProject[]
  compactProjects: CompactProject[]
  skillGroups: Array<{ label: string; items: string[] }>
  about: string
}
