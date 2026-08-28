export type ProjectStatus = '本地静态核验' | '已公开源码' | '已公开基础版' | '历史版本'

export type EvidenceLabel =
  | '公开仓库验证'
  | '本地代码验证'
  | '内容模型声明'
  | '历史运行产物'
  | '本次审查结论'
  | '安全/隐私边界'
  | '需要本人确认'

export interface Metric {
  value: string
  label: string
  source: EvidenceLabel
  note: string
}

export type CaseVisual =
  | { kind: 'image'; src: string; alt: string; caption: string }
  | { kind: 'video'; src: string; poster: string; title: string; caption: string }
  | { kind: 'evidence'; title: string; lines: string[] }
  | { kind: 'agent-replay'; title: string }

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
  verification: { source: EvidenceLabel; runtimeStatus: string; publicBoundary: string }
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
  source: EvidenceLabel
  verificationNote: string
  resultSource: EvidenceLabel
  resultNote: string
  stack: string[]
}

export interface PortfolioData {
  person: {
    name: string
    role: string
    headline: string
    introduction: string
    githubUrl: string
    resumeUrl: string
  }
  heroMetrics: Metric[]
  featuredProjects: FeaturedProject[]
  compactProjects: CompactProject[]
  skillGroups: Array<{ label: string; items: string[] }>
  about: string
}
