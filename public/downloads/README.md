# Downloads

Arquivos servidos como static assets via GitHub Pages.

Suba cada arquivo abaixo direto nesta pasta e commite. Os nomes devem bater
com o que está em `src/data/modules.js`.

## Arquivos esperados

- `commands.zip` — módulo 5 (os 12 commands empacotados)
- `ARQUITETURA-MEMORIA-ASSISTENTE-PESSOAL.md` — módulo 6
- `CONFIGURACOES-TECNICAS.md` — módulo 6
- `instrucao-camada1-sobre-voce.md` — módulo 7
- `instrucao-camada2-sobre-empresa.md` — módulo 7
- `instrucao-camada3-sobre-assistente.md` — módulo 7
- `guia-50-casos-de-uso.pdf` — módulo B2

## Deploy após adicionar arquivos

```bash
git add public/downloads/<arquivo>
git commit -m "docs: add download <nome>"
npm run deploy
```
