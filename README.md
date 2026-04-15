# Materiais de Apoio — Assistente Executivo com IA

Site estático de apoio ao curso "Construa Seu Assistente Executivo com IA" da Suellen Romero.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Testes

```bash
npm test          # single run (22 tests)
npm run test:watch
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview dist/ locally
```

## Deploy (GitHub Pages)

**Pré-requisitos:**

1. Push para `suellen-romero/assistente-executivo-materiais` no GitHub.
2. Settings → Pages → Source: `Deploy from a branch` → Branch: `gh-pages`.

**Deploy:**

```bash
npm run deploy
```

Roda `vite build` e publica `dist/` na branch `gh-pages` via o pacote `gh-pages`.

URL final: `https://suellen-romero.github.io/assistente-executivo-materiais/`

## Arquivos para download

Ponha em `public/downloads/`. Os nomes precisam bater com `src/data/modules.js`. Após adicionar, commite e rode `npm run deploy`.

Lista completa em `public/downloads/README.md`.

## Adicionar conteúdo a módulos com placeholder

Módulo 4 (Obsidian) e módulo 13 (Git) estão com "em breve". Quando tiver conteúdo:

1. Edite `src/data/modules.js`
2. Adicione os blocos/steps ao módulo
3. Rode `npm test && npm run build` pra confirmar
4. `npm run deploy`

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- Vitest + React Testing Library

## Estrutura

```
src/
  data/modules.js       ← conteúdo dos 13 módulos (editável)
  components/           ← 17 componentes
  App.jsx               ← shell do app, state global
public/downloads/       ← arquivos baixáveis
docs/superpowers/       ← spec e plano de implementação
```
