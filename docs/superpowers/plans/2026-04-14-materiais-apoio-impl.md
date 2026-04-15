# Materiais de Apoio — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static React SPA that replicates the functional behavior of `central-aluno-v5.jsx` (copy buttons with permanent green state, dynamic commands with user input interpolation, Mac/Windows toggle, module navigation, real file downloads) with 4 approved polish changes (League Gothic + Raleway typography, refined red `#D63027`, giant decorative module numeral, mobile dropdown module bar), deployed to GitHub Pages.

**Architecture:** Vite + React SPA. Zero backend, zero auth. State lives in `App.jsx` (activeModule, os, inputs). Data in `src/data/modules.js`. Components split by responsibility in `src/components/`. Tailwind for styling with CSS custom properties for tokens. shadcn/ui for a11y primitives (Button, Collapsible). Downloads served as static files from `public/downloads/`.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, shadcn/ui, Vitest + React Testing Library, gh-pages for deploy. Fonts via Google Fonts (Raleway) + CDN (League Gothic).

**Spec:** `docs/superpowers/specs/2026-04-14-materiais-apoio-design.md`

---

## File Structure

Files created by this plan:

```
package.json                              # npm deps + scripts
vite.config.js                            # Vite config with base path
tailwind.config.js                        # Tailwind + design tokens
postcss.config.js                         # PostCSS for Tailwind
index.html                                # Vite entry, font <link>s
vitest.config.js                          # Test runner config
.gitignore                                # node_modules, dist, etc
README.md                                 # Project readme + deploy instructions
.github/workflows/deploy.yml              # GH Actions → gh-pages

public/
  downloads/.gitkeep                      # Placeholder for download files

src/
  main.jsx                                # React entry
  App.jsx                                 # Root component, state owner
  index.css                               # Tailwind directives + CSS vars
  lib/
    utils.js                              # cn() helper for className merging
  data/
    modules.js                            # 13 modules data (extracted from v5)
  components/
    Header.jsx                            # Top title block
    ModuleBar.jsx                         # Module nav (desktop + mobile)
    ModuleHeader.jsx                      # Giant numeral + phase badge + h2
    OSToggle.jsx                          # Mac/Windows pill
    Block.jsx                             # Block container (renders steps)
    CommandBlock.jsx                      # Command with copy button
    CommandDynamicBlock.jsx               # Command with {placeholder} interpolation
    CopyButton.jsx                        # Button with permanent green state
    DownloadButton.jsx                    # Anchor with download attribute
    InputField.jsx                        # Labeled input for tokens/IPs
    WarningBox.jsx                        # Yellow warning box
    InfoStep.jsx                          # › text line
    InfoOSStep.jsx                        # › text that switches Mac/Windows
    LinkStep.jsx                          # › clickable link
    LessonCard.jsx                        # Card for "lessons" modules
    NavFooter.jsx                         # Prev/Next nav
    Footer.jsx                            # Bottom credit line

src/__tests__/
  CopyButton.test.jsx                     # Permanent green state behavior
  CommandDynamicBlock.test.jsx            # Template interpolation
  InputField.test.jsx                     # State hoisting
  ModuleBar.test.jsx                      # Desktop + mobile rendering
  data.test.js                            # Shape validation on modules.js
  App.test.jsx                            # Integration: navigate modules, toggle OS
```

---

## Chunk 1: Project Scaffold & Tooling

### Task 1: Initialize npm project and install dependencies

**Files:**
- Create: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: Create package.json manually**

Write `package.json`:

```json
{
  "name": "assistente-executivo-materiais",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "deploy": "vite build && gh-pages -d dist"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "gh-pages": "^6.2.0",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "vite": "^5.4.10",
    "vitest": "^2.1.4"
  }
}
```

- [ ] **Step 2: Create .gitignore**

```
node_modules
dist
.DS_Store
*.log
.env
.env.local
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`
Expected: all packages install without errors.

- [ ] **Step 4: Initialize git repo and commit**

```bash
cd /Users/suellenromero/Desktop/Assistente_executivo
git init
git add package.json package-lock.json .gitignore
git commit -m "chore: scaffold npm project"
```

---

### Task 2: Vite + React entry files

**Files:**
- Create: `index.html`
- Create: `vite.config.js`
- Create: `src/main.jsx`
- Create: `src/App.jsx` (placeholder)

- [ ] **Step 1: Create index.html**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Materiais de apoio do curso Construa Seu Assistente Executivo com IA — Suellen Romero" />
    <title>Materiais de apoio — Assistente Executivo com IA</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Raleway:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/assistente-executivo-materiais/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 3: Create src/main.jsx**

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 4: Create placeholder src/App.jsx**

```javascript
export default function App() {
  return <div>Loading...</div>
}
```

- [ ] **Step 5: Verify dev server starts**

Run: `npm run dev` (run with timeout 10s, then kill)
Expected: server starts on localhost, no errors in console.

- [ ] **Step 6: Commit**

```bash
git add index.html vite.config.js src/main.jsx src/App.jsx
git commit -m "chore: add Vite + React entry files"
```

---

### Task 3: Tailwind setup with design tokens

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/index.css`
- Create: `src/lib/utils.js`

- [ ] **Step 1: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D63027',
          bg: '#FDF0EF',
        },
        success: {
          DEFAULT: '#1D7A4B',
          bg: '#E8F4ED',
        },
        warning: {
          DEFAULT: '#8B6914',
          bg: '#FFFAF0',
          border: '#F5DEB3',
        },
        link: '#185FA5',
        ink: {
          DEFAULT: '#1A1A1A',
          muted: '#444444',
          soft: '#666666',
          subtle: '#999999',
          tertiary: '#BBBBBB',
        },
        border: {
          DEFAULT: '#DDDDDD',
          soft: '#F0F0F0',
        },
        code: '#FAFAF8',
      },
      fontFamily: {
        display: ['"League Gothic"', 'sans-serif'],
        sans: ['Raleway', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', '"Fira Code"', 'monospace'],
      },
      maxWidth: {
        content: '780px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: Raleway, system-ui, sans-serif;
    color: #1A1A1A;
    background: #FFFFFF;
  }
  body {
    font-size: 13px;
    line-height: 1.5;
  }
  *:focus-visible {
    outline: 2px solid #185FA5;
    outline-offset: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Create src/lib/utils.js**

```javascript
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 5: Update App.jsx to test Tailwind**

Overwrite `src/App.jsx`:

```javascript
export default function App() {
  return (
    <div className="max-w-content mx-auto p-4">
      <h1 className="font-display text-4xl text-primary">Tailwind works</h1>
      <p className="font-sans text-ink-soft">Raleway body text</p>
    </div>
  )
}
```

- [ ] **Step 6: Verify**

Run: `npm run dev` and visit localhost (manually by user, or use Playwright)
Expected: "Tailwind works" in red League Gothic, paragraph in Raleway.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.js postcss.config.js src/index.css src/lib/utils.js src/App.jsx
git commit -m "chore: add Tailwind config with design tokens"
```

---

### Task 4: Vitest setup

**Files:**
- Create: `vitest.config.js`
- Create: `src/test-setup.js`

- [ ] **Step 1: Create vitest.config.js**

```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 2: Create src/test-setup.js**

```javascript
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Write a smoke test**

Create `src/__tests__/smoke.test.jsx`:

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText(/Tailwind works/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.js src/test-setup.js src/__tests__/smoke.test.jsx
git commit -m "chore: add Vitest setup with smoke test"
```

---

## Chunk 2: Data Layer

### Task 5: Extract module data from v5 reference

**Files:**
- Create: `src/data/modules.js`
- Create: `src/__tests__/data.test.js`

- [ ] **Step 1: Write shape validation test**

Create `src/__tests__/data.test.js`:

```javascript
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
```

- [ ] **Step 2: Run test to confirm it fails**

Run: `npm test src/__tests__/data.test.js`
Expected: FAIL (data/modules.js doesn't exist).

- [ ] **Step 3: Create src/data/modules.js**

Copy the `PHASES` and `MODULES` constants from `central-aluno-v5.jsx` verbatim, exporting them. Do not edit content. The source file to reference is the `central-aluno-v5.jsx` document provided with the PRD.

File contents: export `PHASES` (4 items: install, memory, practice, bonus) and `MODULES` (13 items, ids 1–13) exactly as in v5.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all tests pass (smoke + data shape).

- [ ] **Step 5: Commit**

```bash
git add src/data/modules.js src/__tests__/data.test.js
git commit -m "feat(data): extract 13 modules from v5 reference"
```

---

## Chunk 3: Atomic Display Components (no state)

### Task 6: InfoStep, InfoOSStep, LinkStep, WarningBox, LessonCard

**Files:**
- Create: `src/components/InfoStep.jsx`
- Create: `src/components/InfoOSStep.jsx`
- Create: `src/components/LinkStep.jsx`
- Create: `src/components/WarningBox.jsx`
- Create: `src/components/LessonCard.jsx`

- [ ] **Step 1: InfoStep.jsx**

```javascript
export default function InfoStep({ text }) {
  return (
    <div className="flex gap-2 py-1 text-[13px] text-ink-soft leading-relaxed">
      <span className="text-primary flex-shrink-0 mt-px">›</span>
      <span>{text}</span>
    </div>
  )
}
```

- [ ] **Step 2: InfoOSStep.jsx**

```javascript
export default function InfoOSStep({ mac, win, os }) {
  return (
    <div className="flex gap-2 py-1 text-[13px] text-ink-soft leading-relaxed">
      <span className="text-primary flex-shrink-0 mt-px">›</span>
      <span>{os === 'mac' ? mac : win}</span>
    </div>
  )
}
```

- [ ] **Step 3: LinkStep.jsx**

```javascript
export default function LinkStep({ text, url }) {
  return (
    <div className="flex gap-2 py-1 text-[13px]">
      <span className="text-primary flex-shrink-0 mt-px">›</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-link underline hover:no-underline"
      >
        {text}
      </a>
    </div>
  )
}
```

- [ ] **Step 4: WarningBox.jsx**

```javascript
export default function WarningBox({ text }) {
  return (
    <div className="flex gap-2.5 px-3.5 py-2.5 rounded-lg bg-warning-bg border border-warning-border mb-2">
      <span className="text-sm leading-none" aria-hidden="true">⚠</span>
      <span className="text-[13px] text-warning leading-relaxed">{text}</span>
    </div>
  )
}
```

- [ ] **Step 5: LessonCard.jsx**

```javascript
export default function LessonCard({ title, desc }) {
  return (
    <div className="px-4 py-3.5 mb-1.5 rounded-[10px] border border-border-soft bg-white">
      <div className="text-[14px] font-semibold text-ink mb-0.5">{title}</div>
      <div className="text-[12px] text-ink-subtle leading-snug">{desc}</div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/InfoStep.jsx src/components/InfoOSStep.jsx src/components/LinkStep.jsx src/components/WarningBox.jsx src/components/LessonCard.jsx
git commit -m "feat(components): add atomic display components"
```

---

## Chunk 4: Interactive Components (with state)

### Task 7: CopyButton with permanent green state

**Files:**
- Create: `src/components/CopyButton.jsx`
- Create: `src/__tests__/CopyButton.test.jsx`

- [ ] **Step 1: Write failing test**

Create `src/__tests__/CopyButton.test.jsx`:

```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CopyButton from '../components/CopyButton.jsx'

describe('CopyButton', () => {
  it('shows "Copiar" initially', () => {
    render(<CopyButton text="hello" />)
    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument()
  })

  it('copies text to clipboard and switches to "Copiado" on click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const user = userEvent.setup()
    render(<CopyButton text="my-command" />)
    const btn = screen.getByRole('button', { name: /copiar/i })

    await user.click(btn)

    expect(writeText).toHaveBeenCalledWith('my-command')
    expect(screen.getByRole('button', { name: /copiado/i })).toBeInTheDocument()
  })

  it('stays on "Copiado" state permanently after click (no timer reset)', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const user = userEvent.setup()
    render(<CopyButton text="x" />)
    await user.click(screen.getByRole('button'))

    // Wait longer than any plausible reset timer
    await new Promise(r => setTimeout(r, 100))

    expect(screen.getByRole('button', { name: /copiado/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npm test src/__tests__/CopyButton.test.jsx`
Expected: FAIL (component not found).

- [ ] **Step 3: Implement CopyButton.jsx**

```javascript
import { useState } from 'react'
import { cn } from '../lib/utils.js'

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md border font-medium whitespace-nowrap cursor-pointer transition-colors duration-200',
        copied
          ? 'border-success bg-success-bg text-success'
          : 'border-border bg-white text-ink-subtle hover:border-ink-subtle'
      )}
      aria-label={copied ? 'Comando copiado' : 'Copiar comando'}
    >
      {copied ? '✓ Copiado' : 'Copiar'}
    </button>
  )
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all CopyButton tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/CopyButton.jsx src/__tests__/CopyButton.test.jsx
git commit -m "feat(components): add CopyButton with permanent green state"
```

---

### Task 8: CommandBlock (static command with copy)

**Files:**
- Create: `src/components/CommandBlock.jsx`

- [ ] **Step 1: Implement CommandBlock.jsx**

```javascript
import CopyButton from './CopyButton.jsx'

export default function CommandBlock({ label, cmd, note }) {
  return (
    <div className="rounded-lg border border-border-soft overflow-hidden mb-2">
      <div className="flex justify-between items-center px-3 py-1.5 bg-code border-b border-border-soft">
        <span className="text-[12px] font-medium text-ink-muted">{label}</span>
        <CopyButton text={cmd} />
      </div>
      <pre className="m-0 px-3 py-2.5 text-[12px] text-primary bg-white overflow-x-auto whitespace-pre-wrap break-all font-mono leading-relaxed">{cmd}</pre>
      {note && (
        <div className="px-3 py-1.5 text-[11px] text-ink-tertiary italic border-t border-border-soft">{note}</div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CommandBlock.jsx
git commit -m "feat(components): add CommandBlock"
```

---

### Task 9: CommandDynamicBlock with template interpolation

**Files:**
- Create: `src/components/CommandDynamicBlock.jsx`
- Create: `src/__tests__/CommandDynamicBlock.test.jsx`

- [ ] **Step 1: Write failing test**

Create `src/__tests__/CommandDynamicBlock.test.jsx`:

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CommandDynamicBlock from '../components/CommandDynamicBlock.jsx'

describe('CommandDynamicBlock', () => {
  it('renders fallback when input is empty', () => {
    render(
      <CommandDynamicBlock
        label="Test"
        tpl="ssh root@{vps_ip}"
        fb="ssh root@SEU_IP"
        req="vps_ip"
        inputs={{}}
      />
    )
    expect(screen.getByText('ssh root@SEU_IP')).toBeInTheDocument()
  })

  it('replaces placeholder when input is filled', () => {
    render(
      <CommandDynamicBlock
        label="Test"
        tpl="ssh root@{vps_ip}"
        fb="ssh root@SEU_IP"
        req="vps_ip"
        inputs={{ vps_ip: '1.2.3.4' }}
      />
    )
    expect(screen.getByText('ssh root@1.2.3.4')).toBeInTheDocument()
  })

  it('replaces multiple occurrences of the same placeholder', () => {
    render(
      <CommandDynamicBlock
        label="Test"
        tpl="echo {ip} && ping {ip}"
        fb="echo IP && ping IP"
        req="ip"
        inputs={{ ip: '9.9.9.9' }}
      />
    )
    expect(screen.getByText('echo 9.9.9.9 && ping 9.9.9.9')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npm test src/__tests__/CommandDynamicBlock.test.jsx`
Expected: FAIL.

- [ ] **Step 3: Implement CommandDynamicBlock.jsx**

```javascript
import CopyButton from './CopyButton.jsx'
import { cn } from '../lib/utils.js'

export default function CommandDynamicBlock({ label, tpl, fb, req, inputs }) {
  const value = inputs[req]
  const cmd = value ? tpl.replace(new RegExp(`\\{${req}\\}`, 'g'), value) : fb
  const filled = Boolean(value)

  return (
    <div className="rounded-lg border border-border-soft overflow-hidden mb-2">
      <div className="flex justify-between items-center px-3 py-1.5 bg-code border-b border-border-soft">
        <span className="text-[12px] font-medium text-ink-muted">{label}</span>
        <CopyButton text={cmd} />
      </div>
      <pre
        className={cn(
          'm-0 px-3 py-2.5 text-[12px] bg-white overflow-x-auto whitespace-pre-wrap break-all font-mono leading-relaxed',
          filled ? 'text-success' : 'text-primary'
        )}
      >
        {cmd}
      </pre>
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/CommandDynamicBlock.jsx src/__tests__/CommandDynamicBlock.test.jsx
git commit -m "feat(components): add CommandDynamicBlock with template interpolation"
```

---

### Task 10: InputField (controlled)

**Files:**
- Create: `src/components/InputField.jsx`
- Create: `src/__tests__/InputField.test.jsx`

- [ ] **Step 1: Write failing test**

Create `src/__tests__/InputField.test.jsx`:

```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputField from '../components/InputField.jsx'

describe('InputField', () => {
  it('calls onChange with (key, value) when typing', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<InputField label="IP" placeholder="x" keyName="vps_ip" value="" onChange={onChange} />)

    const input = screen.getByPlaceholderText('x')
    await user.type(input, 'a')

    expect(onChange).toHaveBeenCalledWith('vps_ip', 'a')
  })

  it('displays the current value', () => {
    render(<InputField label="IP" placeholder="x" keyName="vps_ip" value="1.2.3.4" onChange={() => {}} />)
    expect(screen.getByDisplayValue('1.2.3.4')).toBeInTheDocument()
  })

  it('associates label with input for a11y', () => {
    render(<InputField label="IP da VPS" placeholder="x" keyName="vps_ip" value="" onChange={() => {}} />)
    expect(screen.getByLabelText(/IP da VPS/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npm test src/__tests__/InputField.test.jsx`
Expected: FAIL.

- [ ] **Step 3: Implement InputField.jsx**

```javascript
import { useId } from 'react'

export default function InputField({ label, placeholder, keyName, value, onChange }) {
  const id = useId()
  return (
    <div className="flex gap-2 items-center py-1.5 flex-wrap">
      <label
        htmlFor={id}
        className="text-[12px] text-ink-subtle min-w-[130px] font-medium"
      >
        {label}:
      </label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(keyName, e.target.value)}
        className="flex-1 min-w-[200px] h-[34px] border border-border rounded-md px-2.5 text-[12px] font-mono bg-code text-ink outline-none focus-visible:border-link"
      />
      <span className="text-[9px] text-border">não armazenado</span>
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/InputField.jsx src/__tests__/InputField.test.jsx
git commit -m "feat(components): add InputField with controlled state"
```

---

### Task 11: DownloadButton (real anchor download)

**Files:**
- Create: `src/components/DownloadButton.jsx`

- [ ] **Step 1: Implement DownloadButton.jsx**

```javascript
export default function DownloadButton({ label, file, desc }) {
  // Use Vite's BASE_URL so paths work on GH Pages
  const href = `${import.meta.env.BASE_URL}downloads/${file}`

  return (
    <a
      href={href}
      download={file}
      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border-[1.5px] border-primary mb-2.5 cursor-pointer transition-colors duration-150 hover:bg-primary-bg no-underline"
      aria-label={`Baixar ${label}`}
    >
      <div className="w-9 h-9 rounded-lg bg-primary-bg flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D63027" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-primary">{label}</div>
        {desc && <div className="text-[11px] text-ink-subtle mt-px">{desc}</div>}
      </div>
      <div className="text-[11px] text-ink-tertiary flex-shrink-0">{file}</div>
    </a>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DownloadButton.jsx
git commit -m "feat(components): add DownloadButton with real href download"
```

---

## Chunk 5: Layout Components

### Task 12: Header, Footer, OSToggle, NavFooter

**Files:**
- Create: `src/components/Header.jsx`
- Create: `src/components/Footer.jsx`
- Create: `src/components/OSToggle.jsx`
- Create: `src/components/NavFooter.jsx`

- [ ] **Step 1: Header.jsx**

```javascript
export default function Header() {
  return (
    <header className="text-center mb-5 pb-3.5 border-b-2 border-primary">
      <div className="text-[10px] tracking-[2.5px] uppercase text-primary font-semibold mb-1">
        Construa seu assistente executivo com IA
      </div>
      <h1 className="text-[22px] font-bold text-ink m-0">Materiais de apoio</h1>
      <p className="text-[12px] text-ink-tertiary m-0">por Suellen Romero</p>
    </header>
  )
}
```

- [ ] **Step 2: Footer.jsx**

```javascript
export default function Footer() {
  return (
    <footer className="text-center mt-8 text-[10px] text-border tracking-wider">
      Suellen Romero — 2026
    </footer>
  )
}
```

- [ ] **Step 3: OSToggle.jsx**

```javascript
import { cn } from '../lib/utils.js'

export default function OSToggle({ os, onChange }) {
  return (
    <div className="flex gap-1 mb-4" role="radiogroup" aria-label="Sistema operacional">
      {[
        { id: 'mac', label: 'Mac' },
        { id: 'win', label: 'Windows' },
      ].map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={os === id}
          onClick={() => onChange(id)}
          className={cn(
            'text-[11px] px-3.5 py-1 rounded-2xl font-medium cursor-pointer transition-colors duration-150',
            os === id
              ? 'border border-primary bg-primary-bg text-primary'
              : 'border border-border bg-white text-ink-tertiary hover:border-ink-subtle'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: NavFooter.jsx**

```javascript
export default function NavFooter({ activeId, totalCount, onPrev, onNext }) {
  const hasPrev = activeId > 1
  const hasNext = activeId < totalCount

  return (
    <nav className="flex justify-between mt-6 pt-4 border-t border-border-soft">
      {hasPrev ? (
        <button
          type="button"
          onClick={onPrev}
          className="text-[13px] text-primary font-medium cursor-pointer bg-transparent border-0 p-0 hover:underline"
        >
          ← Anterior
        </button>
      ) : <div />}
      {hasNext ? (
        <button
          type="button"
          onClick={onNext}
          className="text-[13px] text-primary font-medium cursor-pointer bg-transparent border-0 p-0 hover:underline"
        >
          Próximo →
        </button>
      ) : <div />}
    </nav>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.jsx src/components/Footer.jsx src/components/OSToggle.jsx src/components/NavFooter.jsx
git commit -m "feat(components): add Header, Footer, OSToggle, NavFooter"
```

---

### Task 13: ModuleHeader with giant decorative numeral

**Files:**
- Create: `src/components/ModuleHeader.jsx`

- [ ] **Step 1: Implement ModuleHeader.jsx**

```javascript
export default function ModuleHeader({ module, phase }) {
  return (
    <div className="relative mb-4 min-h-[80px]">
      <span
        aria-hidden="true"
        className="absolute -top-6 right-0 text-[120px] leading-none font-display text-primary-bg select-none pointer-events-none z-0"
      >
        {module.icon}
      </span>
      <div className="relative z-10">
        <div className="inline-block text-[10px] font-semibold uppercase tracking-[1.5px] text-primary bg-primary-bg px-2.5 py-0.5 rounded mb-1.5">
          {phase?.label}
        </div>
        <h2 className="font-display text-[28px] tracking-wide text-ink m-0 leading-tight">
          {module.title}
        </h2>
        {module.content.desc && (
          <p className="text-[13px] text-ink-subtle mt-1 mb-0 leading-snug">
            {module.content.desc}
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ModuleHeader.jsx
git commit -m "feat(components): add ModuleHeader with giant decorative numeral"
```

---

### Task 14: ModuleBar with desktop + mobile dropdown

**Files:**
- Create: `src/components/ModuleBar.jsx`
- Create: `src/__tests__/ModuleBar.test.jsx`

- [ ] **Step 1: Write failing test**

Create `src/__tests__/ModuleBar.test.jsx`:

```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModuleBar from '../components/ModuleBar.jsx'

const modules = [
  { id: 1, icon: '1', title: 'Intro' },
  { id: 2, icon: '2', title: 'Install' },
  { id: 3, icon: '3', title: 'Security' },
]

describe('ModuleBar', () => {
  it('renders all module buttons (desktop)', () => {
    render(<ModuleBar modules={modules} activeId={1} onChange={() => {}} />)
    // Desktop buttons use icon as visible label
    const buttons = screen.getAllByRole('button', { name: /Intro|Install|Security/ })
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })

  it('calls onChange with clicked module id', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ModuleBar modules={modules} activeId={1} onChange={onChange} />)

    const buttons = screen.getAllByRole('button', { name: /Install/ })
    await user.click(buttons[0])
    expect(onChange).toHaveBeenCalledWith(2)
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npm test src/__tests__/ModuleBar.test.jsx`
Expected: FAIL.

- [ ] **Step 3: Implement ModuleBar.jsx**

```javascript
import { useState, useEffect } from 'react'
import { cn } from '../lib/utils.js'

export default function ModuleBar({ modules, activeId, onChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = modules.find(m => m.id === activeId)

  // Close mobile dropdown when module changes
  useEffect(() => {
    setMobileOpen(false)
  }, [activeId])

  return (
    <>
      {/* Desktop: horizontal bar */}
      <div className="hidden md:flex gap-1 mb-5 overflow-x-auto pb-1">
        {modules.map((m) => {
          const active = m.id === activeId
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              title={m.title}
              aria-label={`Módulo ${m.icon}: ${m.title}`}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'min-w-[40px] h-9 rounded-md font-display text-[15px] cursor-pointer flex-shrink-0 transition-colors duration-150 flex items-center justify-center',
                active
                  ? 'border-2 border-primary bg-primary-bg text-primary'
                  : 'border border-border bg-white text-ink-tertiary hover:border-ink-subtle'
              )}
            >
              {m.icon}
            </button>
          )
        })}
      </div>

      {/* Mobile: dropdown */}
      <div className="md:hidden mb-5 relative">
        <button
          type="button"
          onClick={() => setMobileOpen(v => !v)}
          aria-expanded={mobileOpen}
          aria-haspopup="listbox"
          className="w-full flex justify-between items-center px-4 py-2.5 rounded-md border border-primary bg-primary-bg text-primary font-semibold text-[13px] cursor-pointer"
        >
          <span>
            <span className="font-display text-[17px] mr-2">{active?.icon}</span>
            {active?.title}
          </span>
          <span aria-hidden="true">{mobileOpen ? '▴' : '▾'}</span>
        </button>
        {mobileOpen && (
          <ul
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-[60vh] overflow-y-auto"
          >
            {modules.map((m) => {
              const isActive = m.id === activeId
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => onChange(m.id)}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-[13px] cursor-pointer flex items-center gap-2.5 transition-colors',
                      isActive
                        ? 'bg-primary-bg text-primary font-semibold'
                        : 'text-ink-muted hover:bg-code'
                    )}
                  >
                    <span className="font-display text-[15px] min-w-[28px] inline-block text-center">{m.icon}</span>
                    <span>{m.title}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/ModuleBar.jsx src/__tests__/ModuleBar.test.jsx
git commit -m "feat(components): add ModuleBar with desktop + mobile dropdown"
```

---

### Task 15: Block component (renders a block with steps)

**Files:**
- Create: `src/components/Block.jsx`

- [ ] **Step 1: Implement Block.jsx**

```javascript
import CommandBlock from './CommandBlock.jsx'
import CommandDynamicBlock from './CommandDynamicBlock.jsx'
import InputField from './InputField.jsx'
import DownloadButton from './DownloadButton.jsx'
import WarningBox from './WarningBox.jsx'
import InfoStep from './InfoStep.jsx'
import InfoOSStep from './InfoOSStep.jsx'
import LinkStep from './LinkStep.jsx'

export default function Block({ block, idx, os, inputs, setInput }) {
  return (
    <section className="mb-4 p-4 rounded-[10px] border border-border-soft bg-white">
      <header className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-semibold bg-primary-bg text-primary">
          {idx + 1}
        </div>
        <h3 className="text-[15px] font-semibold text-ink m-0">{block.title}</h3>
      </header>
      <div>
        {block.steps.map((s, i) => {
          switch (s.type) {
            case 'command':
              return <CommandBlock key={i} label={s.label} cmd={s.cmd} note={s.note} />
            case 'command_dynamic':
              return <CommandDynamicBlock key={i} label={s.label} tpl={s.tpl} fb={s.fb} req={s.req} inputs={inputs} />
            case 'warning':
              return <WarningBox key={i} text={s.text} />
            case 'info_os':
              return <InfoOSStep key={i} mac={s.mac} win={s.win} os={os} />
            case 'input':
              return (
                <InputField
                  key={i}
                  label={s.label}
                  placeholder={s.placeholder}
                  keyName={s.key}
                  value={inputs[s.key] || ''}
                  onChange={setInput}
                />
              )
            case 'download':
              return <DownloadButton key={i} label={s.label} file={s.file} desc={s.desc} />
            case 'link':
              return <LinkStep key={i} text={s.text} url={s.url} />
            case 'info':
            default:
              return <InfoStep key={i} text={s.text} />
          }
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Block.jsx
git commit -m "feat(components): add Block container rendering all step types"
```

---

## Chunk 6: App Integration

### Task 16: Wire App.jsx

**Files:**
- Modify: `src/App.jsx` (overwrite)
- Modify: `src/__tests__/smoke.test.jsx` (update expectation)

- [ ] **Step 1: Rewrite App.jsx**

```javascript
import { useState, useCallback } from 'react'
import { MODULES, PHASES } from './data/modules.js'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ModuleBar from './components/ModuleBar.jsx'
import ModuleHeader from './components/ModuleHeader.jsx'
import OSToggle from './components/OSToggle.jsx'
import Block from './components/Block.jsx'
import LessonCard from './components/LessonCard.jsx'
import NavFooter from './components/NavFooter.jsx'

export default function App() {
  const [activeId, setActiveId] = useState(1)
  const [os, setOs] = useState('mac')
  const [inputs, setInputs] = useState({})

  const setInput = useCallback((key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }, [])

  const module = MODULES.find(m => m.id === activeId)
  const phase = PHASES.find(p => p.id === module.phase)
  const isBlocks = module.content.type === 'blocks'

  const goTo = (id) => {
    setActiveId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-content mx-auto p-4">
      <Header />

      <ModuleBar modules={MODULES} activeId={activeId} onChange={goTo} />

      <ModuleHeader module={module} phase={phase} />

      {isBlocks && <OSToggle os={os} onChange={setOs} />}

      {isBlocks
        ? module.content.blocks.map((b, i) => (
            <Block key={i} block={b} idx={i} os={os} inputs={inputs} setInput={setInput} />
          ))
        : module.content.lessons.map((l, i) => (
            <LessonCard key={i} title={l.title} desc={l.desc} />
          ))
      }

      <NavFooter
        activeId={activeId}
        totalCount={MODULES.length}
        onPrev={() => goTo(activeId - 1)}
        onNext={() => goTo(activeId + 1)}
      />

      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Update smoke test**

Overwrite `src/__tests__/smoke.test.jsx`:

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

describe('App', () => {
  it('renders header and first module', () => {
    render(<App />)
    expect(screen.getByText(/Materiais de apoio/i)).toBeInTheDocument()
    expect(screen.getByText(/Bem-vinda e contexto/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 4: Verify in browser**

Run: `npm run dev` briefly and open localhost. Navigate modules by clicking buttons. Type in an IP input and confirm a dynamic command updates. Confirm copy button stays green.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/__tests__/smoke.test.jsx
git commit -m "feat(app): wire all components, enable full navigation"
```

---

### Task 17: App integration tests

**Files:**
- Create: `src/__tests__/App.test.jsx`

- [ ] **Step 1: Write integration tests**

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'

describe('App integration', () => {
  it('navigates to module 2 when clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Module 2 desktop button (icon "2", title "Instalação do assistente")
    const buttons = screen.getAllByRole('button', { name: /Instalação do assistente/i })
    await user.click(buttons[0])

    expect(screen.getByRole('heading', { name: /Instalação do assistente/i, level: 2 })).toBeInTheDocument()
  })

  it('typed VPS IP updates dynamic ssh command', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Go to module 2
    const buttons = screen.getAllByRole('button', { name: /Instalação do assistente/i })
    await user.click(buttons[0])

    // Find the VPS IP input (label "IP da VPS")
    const input = screen.getByLabelText(/IP da VPS/i)
    await user.type(input, '5.6.7.8')

    expect(screen.getByText('ssh root@5.6.7.8')).toBeInTheDocument()
  })

  it('Mac/Windows toggle switches OS-dependent text', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Go to module 2 (has info_os steps)
    const buttons = screen.getAllByRole('button', { name: /Instalação do assistente/i })
    await user.click(buttons[0])

    // Default is mac — "Abra o app Terminal..."
    expect(screen.getByText(/Abra o app Terminal/i)).toBeInTheDocument()

    // Click Windows
    await user.click(screen.getByRole('radio', { name: /Windows/i }))

    expect(screen.getByText(/Abra o PowerShell/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/App.test.jsx
git commit -m "test(app): add integration tests for navigation, inputs, OS toggle"
```

---

## Chunk 7: Assets, Deploy & Final Polish

### Task 18: Downloads folder and .gitkeep

**Files:**
- Create: `public/downloads/.gitkeep`
- Create: `public/downloads/README.md`

- [ ] **Step 1: Create placeholder files**

Create `public/downloads/.gitkeep` (empty file).

Create `public/downloads/README.md`:

```markdown
# Downloads

Arquivos servidos como static assets via GitHub Pages.

Nomes esperados (referenciados em `src/data/modules.js`):

- `commands.zip`
- `ARQUITETURA-MEMORIA-ASSISTENTE-PESSOAL.md`
- `CONFIGURACOES-TECNICAS.md`
- `instrucao-camada1-sobre-voce.md`
- `instrucao-camada2-sobre-empresa.md`
- `instrucao-camada3-sobre-assistente.md`
- `guia-50-casos-de-uso.pdf`

Suba os arquivos diretamente nesta pasta e commite.
```

- [ ] **Step 2: Commit**

```bash
git add public/downloads/.gitkeep public/downloads/README.md
git commit -m "chore: add public/downloads placeholder"
```

---

### Task 19: Root README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README.md**

```markdown
# Materiais de Apoio — Assistente Executivo com IA

Site estático de apoio ao curso "Construa Seu Assistente Executivo com IA" da Suellen Romero.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Testes

```bash
npm test          # single run
npm run test:watch
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview dist/ locally
```

## Deploy (GitHub Pages)

Pré-requisitos:
1. Push para o repositório `suellen-romero/assistente-executivo-materiais` no GitHub.
2. Settings → Pages → Source: `Deploy from a branch` → Branch: `gh-pages`.

Deploy manual:

```bash
npm run deploy
```

Isso roda `vite build` e publica `dist/` na branch `gh-pages` via `gh-pages` package.

URL final: `https://suellen-romero.github.io/assistente-executivo-materiais/`

## Arquivos para download

Ponha os arquivos em `public/downloads/`. Os nomes devem bater com o que está em `src/data/modules.js`. Após adicionar, commite e rode `npm run deploy`.

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- Vitest + React Testing Library
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with dev/deploy instructions"
```

---

### Task 20: Build verification

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: no errors. `dist/` folder created.

- [ ] **Step 2: Preview build locally**

Run: `npm run preview` (timeout 10s)
Expected: serves `dist/` on localhost. Visit — app works, module nav works, downloads button points to `/assistente-executivo-materiais/downloads/<file>` (will 404 since files are placeholders, that's expected).

- [ ] **Step 3: Run all tests one more time**

Run: `npm test`
Expected: all pass.

- [ ] **Step 4: Commit if anything changed**

```bash
git status
# if dirty:
git add -A
git commit -m "chore: final build verification"
```

---

## Verification Criteria

After all tasks complete:

- [ ] `npm test` passes with all suites green
- [ ] `npm run build` produces `dist/` with no errors
- [ ] `npm run dev` + manual check:
  - [ ] Click module buttons navigates
  - [ ] Copy button goes green permanently
  - [ ] Dynamic command turns green when input is filled
  - [ ] Mac/Windows toggle changes info_os text
  - [ ] Download button has `href` pointing to `/assistente-executivo-materiais/downloads/<file>` with `download` attribute
  - [ ] Mobile viewport (375px): module bar becomes dropdown
  - [ ] Giant module numeral appears behind module title
  - [ ] Tab + Enter navigates and activates buttons
- [ ] Git log shows clean, bite-sized commits

---

## Deferred Work (out of this plan)

1. **Auth** — student-only access. Decide approach later.
2. **Download files** — Suellen uploads directly to `public/downloads/` when ready.
3. **Module 4 (Obsidian) & 13 (Git) content** — placeholder until user provides.
4. **Custom domain** — `materiais.suellenromero.com` via CNAME — optional, later.
5. **GitHub Actions workflow** — if user prefers CI-driven deploy, add `.github/workflows/deploy.yml` (current plan uses local `npm run deploy`).

---

## Notes for Executor

- **Commit after each step as stated.** If a step says "Commit", do the commit.
- **Do not skip TDD order** on tasks 7, 9, 10, 14, 17 — write test → verify fail → implement → verify pass.
- **Browser verification steps** (Task 16 step 4, Task 20 step 2) can use Playwright MCP if available, otherwise skip and rely on tests + build success.
- **Reference**: `central-aluno-v5.jsx` is the source of truth for data content in Task 5. Copy `MODULES` and `PHASES` verbatim.
- **Spec**: `docs/superpowers/specs/2026-04-14-materiais-apoio-design.md` has design rationale.
