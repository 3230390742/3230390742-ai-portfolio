import { Check, ShieldCheck } from 'lucide-react'
import { useId, useState, type KeyboardEvent } from 'react'
import type { AgentReplay, AgentReplayRun, AgentReplayTab } from '../content/agentReplay'
import styles from './AgentMcpReplay.module.css'

const tabs: Array<{ id: AgentReplayTab; label: string }> = [
  { id: 'run', label: '运行控制台' },
  { id: 'compare', label: 'Agent 对比' },
  { id: 'audit', label: '安全审计' },
]

function RunPanel({ replay }: { replay: AgentReplay }) {
  return (
    <div className={styles.panel}>
      <dl className={styles.policy}>
        <div><dt>Mode</dt><dd>Read only</dd></div>
        <div><dt>Allowed root</dt><dd>{replay.policy.allowedRoot}</dd></div>
        <div><dt>Concurrency</dt><dd>{replay.policy.maxConcurrency}</dd></div>
        <div><dt>Process</dt><dd>shell:false</dd></div>
      </dl>
      <p className={styles.prompt}>{replay.scenario.prompt}</p>
      <ol className={styles.stages} aria-label="执行阶段">
        {replay.stages.map((stage) => (
          <li key={stage.id}>
            <Check aria-hidden="true" />
            <strong>{stage.id === 'authorize' ? 'realpath allowlist' : stage.id}</strong>
            <p>{stage.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function AgentResult({ run, title }: { run: AgentReplayRun; title: string }) {
  return (
    <section aria-label={`${title} 运行结果`}>
      <div className={styles.agentHeading}>
        <h5>{title}</h5>
        <span>{run.status}</span>
      </div>
      <dl className={styles.activity}>
        <div><dt>Duration</dt><dd>{run.durationMs} ms</dd></div>
        <div><dt>Commands</dt><dd>{run.activity.commands}</dd></div>
        <div><dt>Files</dt><dd>{run.activity.files}</dd></div>
      </dl>
      <p className={styles.message}>{run.finalMessage ?? 'No final message'}</p>
    </section>
  )
}

function ComparePanel({ replay }: { replay: AgentReplay }) {
  return (
    <div className={styles.panel}>
      <div className={styles.split}>
        <AgentResult run={replay.comparison.codex} title="Codex" />
        <AgentResult run={replay.comparison.opencode} title="OpenCode" />
      </div>
      <p className={styles.note}>{replay.comparison.note}</p>
    </div>
  )
}

function AuditPanel({ replay }: { replay: AgentReplay }) {
  return (
    <div className={styles.panel}>
      <div className={styles.auditSummary}>
        <div><strong>{replay.publication.status}</strong><span>历史运行产物</span></div>
        <div><strong>{replay.verification.testsPassed}/{replay.verification.testsTotal}</strong><span>历史测试记录</span></div>
        <div><strong>{replay.verification.typecheck}</strong><span>历史 typecheck 记录</span></div>
      </div>
      <dl className={styles.policy}>
        <div><dt>Write access</dt><dd>{String(replay.policy.writeAllowed)}</dd></div>
        <div><dt>Shell</dt><dd>{String(replay.policy.shell)}</dd></div>
      </dl>
      <ul className={styles.checks}>
        {replay.publication.checks.map((check) => (
          <li key={check}><Check aria-hidden="true" />{check}</li>
        ))}
      </ul>
    </div>
  )
}

export function AgentMcpReplay({ replay }: { replay: AgentReplay }) {
  const [active, setActive] = useState<AgentReplayTab>('run')
  const prefix = useId()

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const current = tabs.findIndex((tab) => tab.id === active)
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const next = tabs[(current + delta + tabs.length) % tabs.length]
    setActive(next.id)
    document.getElementById(`${prefix}-tab-${next.id}`)?.focus()
  }

  return (
    <section className={styles.replay} aria-label="Local Agent MCP 历史运行回放">
      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>RECORDED LOCALLY</span>
          <h4>历史运行回放</h4>
        </div>
        <span className={styles.ready}><ShieldCheck aria-hidden="true" />HISTORICAL RECORD</span>
      </header>
      <div className={styles.tabs} role="tablist" aria-label="回放视图" aria-orientation="horizontal" onKeyDown={onKeyDown}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${prefix}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`${prefix}-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${prefix}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${prefix}-tab-${tab.id}`}
          hidden={active !== tab.id}
        >
          {tab.id === 'run' && <RunPanel replay={replay} />}
          {tab.id === 'compare' && <ComparePanel replay={replay} />}
          {tab.id === 'audit' && <AuditPanel replay={replay} />}
        </div>
      ))}
    </section>
  )
}
