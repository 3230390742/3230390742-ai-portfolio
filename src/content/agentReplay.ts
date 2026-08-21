import manifest from './artifacts/local-agent-mcp/demo-manifest.json'
import receipt from './artifacts/local-agent-mcp/publication-receipt.json'

export type AgentReplayTab = 'run' | 'compare' | 'audit'
export type AgentReplayRun = {
  agent: 'codex' | 'opencode'
  status: 'passed' | 'failed'
  durationMs: number
  finalMessage: string | null
  activity: { commands: number; files: number }
  errors: string[]
}
type AgentReplayManifest = typeof manifest & {
  comparison: { codex: AgentReplayRun; opencode: AgentReplayRun }
}
export type AgentReplay = AgentReplayManifest & { publication: typeof receipt }

function assertReplay(value: typeof manifest): asserts value is AgentReplayManifest {
  if (value.schemaVersion !== 1) throw new Error('unsupported Agent replay schema')
  if (value.scenario.mode !== 'read_only' || value.policy.writeAllowed !== false || value.policy.shell !== false) {
    throw new Error('unsafe Agent replay policy')
  }
  if (value.comparison.codex.status !== 'passed' || value.comparison.opencode.status !== 'passed') {
    throw new Error('incomplete Agent replay')
  }
}

assertReplay(manifest)
if (receipt.status !== 'PUBLICATION_OK') throw new Error('Agent replay publication failed')
export const agentReplay: AgentReplay = { ...manifest, publication: receipt }
