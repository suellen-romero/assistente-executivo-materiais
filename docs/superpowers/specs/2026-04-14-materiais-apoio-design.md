# Design Spec — Materiais de Apoio (Assistente Executivo com IA)

**Data:** 2026-04-14
**Autora:** Suellen Romero
**Status:** Draft para revisão

---

## 1. Goal

Site estático (single-page React app) que serve como material de apoio do curso "Construa Seu Assistente Executivo com IA". **Não é área de membros** (isso fica na Hotmart/Kiwify) — é uma página complementar com instruções técnicas, comandos copiáveis e downloads.

**Público:** executivos (C-level, founders, líderes sênior) sem experiência técnica, seguindo tutorial passo-a-passo de instalação de assistente no Telegram via VPS + Claude Code.

**Sucesso:** aluno consegue instalar o assistente executando comandos sem precisar pedir ajuda. Copiar um comando uma única vez é óbvio. Saber o que já foi copiado evita repetição.

---

## 2. Escopo

### In-scope
- Réplica funcional 1:1 do `central-aluno-v5.jsx` (navegação entre 13 módulos, blocos de comando com copiar, toggle Mac/Windows, inputs dinâmicos que preenchem comandos, downloads reais de arquivos)
- 4 polidas acordadas (ver seção 5)
- Deploy no GitHub Pages
- Responsivo desktop + mobile

### Out-of-scope (adiado)
- **Controle de acesso (aluno-only)** — decidir depois. 3 caminhos na mesa: senha client-side simples / Cloudflare Access (grátis, login por email) / iframe dentro da Hotmart. Sem decisão agora.
- **Conteúdo de módulo 4 (Obsidian) e módulo 13 (Git Obsidian+VPS)** — placeholder "em breve" até a Suellen mandar.
- **Arquivos de download que ainda não existem** (camada 1/2/3, guia 50 casos) — Suellen confirmou que estão prontos, vai subir na pasta `public/downloads/` direto.

---

## 3. Stack

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Framework | React 18 + Vite | PRD definiu. Build rápido, zero config. |
| Styling | **Tailwind CSS + shadcn/ui** | Suellen aprovou. Tailwind dá consistência; shadcn dá componentes acessíveis prontos (Button, Input, Tooltip). |
| Fonte | League Gothic (títulos) + Raleway (corpo) | Google Fonts, carregamento via `<link>` ou `@fontsource`. |
| Deploy | GitHub Pages | PRD definiu. `base: '/assistente-executivo-materiais/'` no vite.config. |
| Hospedagem de downloads | `public/downloads/` | Arquivos servidos pelo próprio GitHub Pages. |

**Sem backend, sem banco, sem auth (por ora).**

---

## 4. Design System

### 4.1 Cores

```
--color-primary:      #D63027   (vermelho-fogo, era #C4423D no v5)
--color-primary-bg:   #FDF0EF   (fundo claro do vermelho)
--color-success:      #1D7A4B   (verde "copiado")
--color-success-bg:   #E8F4ED
--color-warning:      #8B6914   (texto warning)
--color-warning-bg:   #FFFAF0
--color-warning-bd:   #F5DEB3
--color-link:         #185FA5   (azul de link)

/* Grays */
--color-text:         #1A1A1A   (títulos)
--color-text-muted:   #444444   (labels)
--color-text-soft:    #666666   (corpo)
--color-text-subtle:  #999999   (descrições)
--color-text-tertiary:#BBBBBB   (terciário)
--color-border:       #DDDDDD
--color-border-soft:  #F0F0F0
--color-bg-code:      #FAFAF8   (fundo de bloco de código)
--color-bg:           #FFFFFF   (fundo da página)
```

Light mode apenas (decisão do v5 mantida).

### 4.2 Tipografia

- **League Gothic** — h1, h2, numerais grandes decorativos (polida #3)
- **Raleway** — corpo, labels, botões, descrições
- **Monospace** — 'SF Mono', 'Fira Code', monospace — código e blocos de comando

**Escala:**
- h1 (título da página): Raleway 700, 22px
- h2 (título do módulo): League Gothic 400, 28px, letter-spacing 0.02em
- h3 (título de bloco): Raleway 600, 15px
- Corpo: Raleway 400, 13px, line-height 1.5
- Labels: Raleway 500, 12px
- Código: mono 12px, line-height 1.6
- Notas: 11px
- Micro: 10px

**Numeral decorativo (polida #3):** League Gothic 400, 120px, cor `#FDF0EF` (primary-bg), posicionado atrás do título do módulo com `z-index: -1` e `opacity: 0.5`.

### 4.3 Layout

- Max-width: 780px, centralizado
- Padding horizontal: 1rem (mobile) / 1.5rem (desktop)
- Espaçamento entre blocos: 16px
- Cards/blocos: border-radius 10px, border 1px `#F0F0F0`

### 4.4 Responsividade (polida #4)

- **Desktop (≥768px):** barra de módulos horizontal com todos os 13 botões visíveis.
- **Mobile (<768px):** barra vira **menu dropdown** — botão que mostra "Módulo 2 — Instalação ▾" e abre lista completa ao clicar. Mesmo comportamento funcional; UX melhor em tela pequena.

---

## 5. Polidas Aprovadas (vs v5 original)

| # | Polida | Status |
|---|--------|--------|
| 1 | Tipografia: League Gothic (títulos) + Raleway (corpo) | ✅ |
| 2 | Vermelho refinado: `#C4423D` → `#D63027` | ✅ |
| 3 | Numeral decorativo do módulo (ex: "02" em 120px atrás do título) | ✅ |
| 4 | Mobile: barra de módulos vira dropdown expansível | ✅ |

---

## 6. Componentes

Todos os componentes ficam em `src/components/`. Cada um em arquivo separado.

### 6.1 Header
- Linha superior: "CONSTRUA SEU ASSISTENTE EXECUTIVO COM IA" (uppercase, letter-spacing, cor primary)
- h1: "Materiais de apoio"
- Subtítulo: "por Suellen Romero"
- Borda inferior 2px primary

### 6.2 ModuleBar
- **Desktop:** botões horizontais, scroll em caso de overflow (backup), ativo tem borda primary e bg `primary-bg`.
- **Mobile:** `<details>`/`<summary>` ou dropdown shadcn — mostra módulo atual, expande lista.
- Clique muda estado e rola pro topo.

### 6.3 CopyButton
- Estado inicial: texto "Copiar", borda cinza, cor cinza.
- Após clique: copia pro clipboard via `navigator.clipboard.writeText()` e muda para "✓ Copiado" verde.
- **Permanente:** não volta ao estado inicial (polida funcional do v5 mantida).
- Reset apenas quando o módulo muda (ou seja, estado vive no componente do bloco, que é desmontado ao trocar módulo).

### 6.4 CommandBlock
- Header cinza com label + CopyButton à direita
- Body: `<pre>` mono, código em cor primary (`#D63027`)
- Nota opcional abaixo (itálico, cinza)

### 6.5 CommandDynamicBlock
- Recebe template (`tpl`), fallback (`fb`) e chave do input (`req`)
- Se o input foi preenchido, substitui `{key}` pelo valor e renderiza em verde
- Se não, renderiza `fb` em vermelho
- Copia a versão atual (dinâmica ou fallback)

### 6.6 InputField
- Label à esquerda (min-width 130px)
- Input mono, placeholder descritivo
- Texto "não armazenado" ao lado (cinza minúsculo)
- **Estado fica apenas no React state.** Nunca persiste (nem localStorage, nem URL).

### 6.7 DownloadButton
- Visual: ícone download + label + descrição + nome do arquivo à direita
- **Implementação:** `<a href="/assistente-executivo-materiais/downloads/{file}" download>` — download direto, sem JS, sem alert.
- Arquivos ficam em `public/downloads/` no repo.

### 6.8 WarningBox
- Fundo `#FFFAF0`, borda `#F5DEB3`, ícone ⚠, texto `#8B6914`

### 6.9 InfoStep / InfoOSStep / LinkStep
- Linha com "›" primary + texto cinza
- `InfoOSStep` troca texto conforme toggle Mac/Windows
- `LinkStep` abre em nova aba

### 6.10 LessonCard
- Para módulos tipo "lessons" (só vídeo)
- Título bold + descrição cinza, sem interação

### 6.11 OSToggle
- Dois botões pill (Mac / Windows)
- Aparece apenas em módulos tipo "blocks"

### 6.12 ModuleHeader
- Container com numeral decorativo gigante (polida #3)
- Badge de fase ("INSTALAÇÃO E CONFIGURAÇÃO" etc)
- h2 do módulo + descrição

### 6.13 NavFooter
- "← Anterior" (se não for primeiro) | "Próximo →" (se não for último)

### 6.14 Footer
- "Suellen Romero — 2026" centralizado, cinza claro

---

## 7. Dados

Tudo em `src/data/modules.js`. Estrutura idêntica ao v5 (13 módulos, 4 fases). Ver `central-aluno-v5.jsx` como source of truth — extrair sem alterar o conteúdo.

**Tipos de step dentro de um block:** `info`, `info_os`, `warning`, `command`, `command_dynamic`, `input`, `download`, `link`.

---

## 8. Downloads

Pasta `public/downloads/`:

| Arquivo | Módulo |
|---------|--------|
| `commands.zip` | 5 |
| `ARQUITETURA-MEMORIA-ASSISTENTE-PESSOAL.md` | 6 |
| `CONFIGURACOES-TECNICAS.md` | 6 |
| `instrucao-camada1-sobre-voce.md` | 7 |
| `instrucao-camada2-sobre-empresa.md` | 7 |
| `instrucao-camada3-sobre-assistente.md` | 7 |
| `guia-50-casos-de-uso.pdf` | B2 |

Suellen subirá os arquivos diretamente nessa pasta (ela já tem todos).

---

## 9. Estrutura do Repositório

```
assistente-executivo-materiais/
├── public/
│   └── downloads/          ← arquivos para baixar
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ModuleBar.jsx
│   │   ├── ModuleHeader.jsx
│   │   ├── OSToggle.jsx
│   │   ├── Block.jsx
│   │   ├── CommandBlock.jsx
│   │   ├── CommandDynamicBlock.jsx
│   │   ├── CopyButton.jsx
│   │   ├── DownloadButton.jsx
│   │   ├── InputField.jsx
│   │   ├── WarningBox.jsx
│   │   ├── InfoStep.jsx
│   │   ├── InfoOSStep.jsx
│   │   ├── LinkStep.jsx
│   │   ├── LessonCard.jsx
│   │   ├── NavFooter.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   └── modules.js
│   ├── lib/
│   │   └── utils.js        ← cn() do shadcn
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css           ← Tailwind directives + tokens CSS
├── index.html
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

## 10. Estado da Aplicação

**Três pedaços de state, todos no `App.jsx`:**

1. `activeModule` (number) — id do módulo ativo (1..13)
2. `os` (string) — "mac" ou "win"
3. `inputs` (object) — `{ vps_ip: "...", bot_token: "...", ... }`

**Nada persiste.** Sem localStorage, sem URL, sem cookies. Ao reload, volta ao estado zero (mas os botões "Copiado" do módulo atual resetam — comportamento desejado, módulo novo começa limpo).

---

## 11. Acessibilidade

- Contraste mínimo 4.5:1 em todo texto de corpo (verificado com palette acima)
- `aria-label` em botões icon-only (CopyButton tem texto, mas DownloadButton precisa)
- `cursor: pointer` em tudo clicável
- Focus states visíveis (anel azul shadcn default)
- `prefers-reduced-motion` respeitado em transições
- Ordem de tab = ordem visual
- Input com `<label htmlFor>`
- Touch targets mínimo 44x44px no mobile

---

## 12. Deploy

1. Repositório público: `suellen-romero/assistente-executivo-materiais` (nome a confirmar)
2. `vite.config.js` com `base: '/assistente-executivo-materiais/'`
3. Deploy via GitHub Actions (workflow padrão de Vite + gh-pages) OU package `gh-pages` rodando `npm run deploy`
4. Settings → Pages → source: gh-pages branch
5. URL final: `https://suellen-romero.github.io/assistente-executivo-materiais/`
6. Domínio custom (`materiais.suellenromero.com`) é opcional e pode ser adicionado depois via CNAME.

---

## 13. Decisões Adiadas

1. **Auth (aluno-only)** — decidir depois. Opções: senha simples, Cloudflare Access, iframe Hotmart.
2. **Conteúdo módulo 4 (Obsidian) e 13 (Git)** — placeholder "em breve" até Suellen enviar.
3. **Domínio custom** — pode subir depois.

---

## 14. Critérios de Aceite

- [ ] Copiar comando muda botão pra verde permanente dentro do módulo
- [ ] Digitar IP/token atualiza os `command_dynamic` em tempo real, muda cor pra verde
- [ ] Toggle Mac/Windows troca texto dos `info_os`
- [ ] Download clica e baixa arquivo real (não alert)
- [ ] Mobile: módulos em dropdown, desktop: barra horizontal
- [ ] Numeral gigante do módulo aparece atrás do título
- [ ] Tipografia League Gothic + Raleway carregadas
- [ ] Navegação Anterior/Próximo rola pro topo
- [ ] Acessível por teclado (tab + enter funcionam em tudo)
- [ ] Build funciona com `base` configurada (links de download não quebram no GitHub Pages)
- [ ] Responsivo testado em 375px / 768px / 1024px / 1440px

---

## 15. Riscos

1. **Paths de download no GitHub Pages** — `base` precisa estar certa, senão `/downloads/` quebra. Mitigação: testar build local com `npm run preview` e importar arquivos via path relativo se necessário.
2. **Tamanho do bundle com shadcn** — usar só componentes que precisamos (Button, Input, Collapsible). Não subir a lib inteira.
3. **League Gothic em mobile** — fonte display condensada pode ficar apertada. Mitigação: usar só em h1/h2 e numeral, não em labels.
4. **Estado perdido no reload** — aceito. Comportamento desejado: sessão fresca.
