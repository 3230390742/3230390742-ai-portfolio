import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { portfolioData } from '../content/portfolio'
import { Hero } from './Hero'

describe('Hero', () => {
  it('states the approved positioning and exposes both primary actions', () => {
    render(<Hero person={portfolioData.person} metrics={portfolioData.heroMetrics} />)

    expect(
      screen.getByRole('heading', { level: 1, name: '把 AI 原型做成可验证的产品。' }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: '查看重点项目' })).toHaveAttribute(
      'href',
      '#featured-work',
    )
    expect(screen.getByRole('link', { name: '下载中文简历' })).toHaveAttribute('download')
    expect(screen.getAllByTestId('hero-metric')).toHaveLength(3)
  })
})
