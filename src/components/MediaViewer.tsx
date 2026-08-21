import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CaseVisual, FeaturedProject } from '../content/types'
import styles from './MediaViewer.module.css'

type OpenableVisual = Exclude<CaseVisual, { kind: 'evidence' } | { kind: 'agent-replay' }>

export function MediaViewer({ project, initialIndex, onClose }: { project: FeaturedProject; initialIndex: number; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const media = useMemo(() => project.visuals.filter((visual): visual is OpenableVisual => visual.kind !== 'evidence' && visual.kind !== 'agent-replay'), [project.visuals])
  const requested = project.visuals[initialIndex]
  const startingIndex = requested.kind === 'evidence' || requested.kind === 'agent-replay' ? 0 : Math.max(0, media.indexOf(requested))
  const [index, setIndex] = useState(startingIndex)
  const [mediaFailed, setMediaFailed] = useState(false)
  const current = media[index]

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      if (dialog?.open) dialog.close()
    }
  }, [onClose])

  useEffect(() => setMediaFailed(false), [index])

  if (!current) return null

  const previous = () => setIndex((value) => (value - 1 + media.length) % media.length)
  const next = () => setIndex((value) => (value + 1) % media.length)

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-label={`${project.title}媒体`} onCancel={(event) => { event.preventDefault(); onClose() }}>
      <div className={styles.toolbar}>
        <p>{current.kind === 'image' ? current.caption : current.title}</p>
        <button type="button" aria-label="关闭媒体" title="关闭媒体" onClick={onClose}><X aria-hidden="true" /></button>
      </div>
      <div className={styles.stage}>
        {mediaFailed && current.kind === 'video'
          ? <div className={styles.fallback}><img src={current.poster} alt={current.title} /><span role="status">媒体暂不可用，请查看项目文字与证据。</span></div>
          : (mediaFailed
          ? <div className={styles.fallback} role="img" aria-label="媒体加载失败"><strong>{current.kind === 'image' ? current.caption : current.title}</strong><span>媒体暂不可用，请查看项目文字与证据。</span></div>
          : current.kind === 'image'
            ? <img src={current.src} alt={current.alt} onError={() => setMediaFailed(true)} />
            : <video src={current.src} poster={current.poster} title={current.title} controls muted playsInline preload="metadata" onError={() => setMediaFailed(true)} />)}
      </div>
      {media.length > 1 && <div className={styles.navigation}>
        <button type="button" aria-label="上一个媒体" title="上一个媒体" onClick={previous}><ChevronLeft aria-hidden="true" /></button>
        <span>{index + 1} / {media.length}</span>
        <button type="button" aria-label="下一个媒体" title="下一个媒体" onClick={next}><ChevronRight aria-hidden="true" /></button>
      </div>}
    </dialog>
  )
}
