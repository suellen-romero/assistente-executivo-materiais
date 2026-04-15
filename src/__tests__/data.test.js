import { describe, it, expect } from 'vitest'
import { MODULES, PHASES } from '../data/modules.js'

describe('modules.js', () => {
  it('has 13 modules', () => {
    expect(MODULES).toHaveLength(13)
  })

  it('every module has id, icon, title, phase, content', () => {
    for (const m of MODULES) {
      expect(m).toHaveProperty('id')
      expect(m).toHaveProperty('icon')
      expect(m).toHaveProperty('title')
      expect(m).toHaveProperty('phase')
      expect(m).toHaveProperty('content')
      expect(['lessons', 'blocks']).toContain(m.content.type)
    }
  })

  it('module ids are 1..13', () => {
    expect(MODULES.map(m => m.id)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12,13])
  })

  it('every module phase exists in PHASES', () => {
    const phaseIds = PHASES.map(p => p.id)
    for (const m of MODULES) {
      expect(phaseIds).toContain(m.phase)
    }
  })

  it('blocks modules have blocks array', () => {
    for (const m of MODULES) {
      if (m.content.type === 'blocks') {
        expect(Array.isArray(m.content.blocks)).toBe(true)
        expect(m.content.blocks.length).toBeGreaterThan(0)
      }
    }
  })

  it('lessons modules have lessons array', () => {
    for (const m of MODULES) {
      if (m.content.type === 'lessons') {
        expect(Array.isArray(m.content.lessons)).toBe(true)
        expect(m.content.lessons.length).toBeGreaterThan(0)
      }
    }
  })

  it('every block step has a valid type', () => {
    const validTypes = ['info', 'info_os', 'warning', 'command', 'command_dynamic', 'input', 'download', 'link']
    for (const m of MODULES) {
      if (m.content.type !== 'blocks') continue
      for (const block of m.content.blocks) {
        for (const step of block.steps) {
          expect(validTypes).toContain(step.type)
        }
      }
    }
  })
})
