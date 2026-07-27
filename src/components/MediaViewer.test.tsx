import { fireEvent, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { portfolioData } from '../content/portfolio'
import { MediaViewer } from './MediaViewer'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    if (this.open) throw new DOMException('The dialog is already open', 'InvalidStateError')
    this.open = true
  })
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) { this.open = false })
})

describe('MediaViewer', () => {
  it('shows media without autoplay and closes on Escape', () => {
    const onClose = vi.fn()
    render(<MediaViewer project={portfolioData.featuredProjects[0]} initialIndex={2} onClose={onClose} />)

    expect(screen.getByRole('dialog', { name: '个人 RAG 知识库媒体' })).toBeVisible()
    expect(screen.getByTitle('个人 RAG 知识库演示')).not.toHaveAttribute('autoplay')

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('supports StrictMode effect replay without reopening an open dialog', () => {
    expect(() => render(
      <StrictMode>
        <MediaViewer project={portfolioData.featuredProjects[0]} initialIndex={0} onClose={vi.fn()} />
      </StrictMode>,
    )).not.toThrow()
  })

  it('keeps the video poster and explains when playback fails', () => {
    const { container } = render(<MediaViewer project={portfolioData.featuredProjects[0]} initialIndex={2} onClose={vi.fn()} />)

    const video = container.querySelector('video')
    expect(video).not.toBeNull()
    fireEvent.error(video!)

    const dialog = container.querySelector('dialog')!
    expect(dialog.querySelector('img')).toHaveAttribute('src', '/media/projects/personal-rag-ai-research.png')
    expect(dialog.querySelector('[role="status"]')).toHaveTextContent(/\S/)
  })
})
