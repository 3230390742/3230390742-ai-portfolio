import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { portfolioData } from '../content/portfolio'
import { Hero } from './Hero'

describe('Hero', () => {
  it('states the approved positioning and exposes both primary actions', () => {
    const { container } = render(<Hero person={portfolioData.person} metrics={portfolioData.heroMetrics} />)

    expect(
      screen.getByRole('heading', { level: 1, name: '让 AI 原型真正成为产品。' }),
    ).toBeVisible()
    expect(screen.getByText('AI APPLICATION ENGINEER · 2026')).toBeVisible()
    expect(screen.getByTestId('cinematic-orbit')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('link', { name: '探索代表作' })).toHaveAttribute(
      'href',
      '#featured-work',
    )
    expect(screen.getByRole('link', { name: '下载中文简历' })).toHaveAttribute('download')
    expect(screen.getAllByTestId('hero-metric')).toHaveLength(4)
    expect(container.querySelectorAll('dl[aria-label="作品集概览"] p')).toHaveLength(0)
  })
})
