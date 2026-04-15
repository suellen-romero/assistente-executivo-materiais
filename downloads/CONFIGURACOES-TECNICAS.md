# CONFIGURAÇÕES TÉCNICAS DO ASSISTENTE EXECUTIVO

> Faça upload deste arquivo na VPS e peça ao seu assistente no Telegram:
> "Leia o arquivo CONFIGURACOES-TECNICAS.md e execute todas as configurações descritas nele."
> O assistente vai configurar tudo automaticamente.

---

## 1. MANUTENÇÃO AUTOMÁTICA DE MEMÓRIA

### 1.1 Manutenção semanal (toda segunda-feira às 7h)

Criar um script que roda toda segunda-feira e executa:

Arquivo: ~/assistente-executivo/scripts/manutencao-semanal.sh

```bash
#!/bin/bash
# Manutenção semanal da memória do assistente
DATA=$(date +%Y-%m-%d)

cd ~/assistente-executivo

# 1. Mover pendências concluídas há mais de 7 dias para arquivo
if [ -f memoria/pendencias.md ]; then
  grep -n "\[x\]" memoria/pendencias.md | while read line; do
    echo "$line" >> memoria/arquivo/pendencias-concluidas.md
  done
  # Manter apenas pendências abertas
  grep -v "\[x\]" memoria/pendencias.md > /tmp/pendencias-tmp.md
  mv /tmp/pendencias-tmp.md memoria/pendencias.md
fi

# 2. Rotacionar sessões com mais de 7 dias
find sessoes/ -maxdepth 1 -name "*.md" -mtime +7 -exec mv {} sessoes/arquivo/ \;

# 3. Mover decisões com mais de 90 dias (exceto permanentes)
# O assistente faz isso melhor via Telegram pois precisa ler o conteúdo

echo "[$DATA] Manutenção semanal executada" >> ~/assistente-executivo/logs/manutencao.log
```

Cron para agendar:
```
0 7 * * 1 /home/assistente/assistente-executivo/scripts/manutencao-semanal.sh
```

### 1.2 Verificação diária de pendências atrasadas (todo dia às 7h)

Arquivo: ~/assistente-executivo/scripts/check-pendencias.sh

```bash
#!/bin/bash
# Verifica pendências com prazo vencido
DATA_HOJE=$(date +%Y-%m-%d)
cd ~/assistente-executivo

if [ -f memoria/pendencias.md ]; then
  # Contar pendências abertas
  ABERTAS=$(grep -c "\[ \]" memoria/pendencias.md 2>/dev/null || echo 0)
  echo "[$DATA_HOJE] Pendências abertas: $ABERTAS" >> logs/manutencao.log
fi
```

Cron:
```
0 7 * * * /home/assistente/assistente-executivo/scripts/check-pendencias.sh
```

---

## 2. ESTRUTURA DE PASTAS NECESSÁRIA

Criar as seguintes pastas e arquivos se não existirem:

```
~/assistente-executivo/
├── scripts/
│   ├── manutencao-semanal.sh
│   └── check-pendencias.sh
├── logs/
│   └── manutencao.log
├── camada1-voce/
├── camada2-empresa/
├── camada3-assistente/
├── memoria/
│   ├── decisoes.md
│   ├── pendencias.md
│   ├── preferencias.md
│   ├── aprendizados.md
│   ├── contexto-semanal.md
│   └── arquivo/
│       ├── pendencias-concluidas.md
│       └── decisoes-antigas.md
├── sessoes/
│   └── arquivo/
├── templates/
├── processos/
├── anexos/
│   ├── contratos/
│   ├── apresentacoes/
│   ├── financeiro/
│   ├── rh/
│   └── arquivo/
├── time/
│   ├── config.md
│   ├── reports/
│   └── panorama-semanal.md
└── .claude/
    └── commands/
```

---

## 3. PERMISSÕES DE SEGURANÇA

Executar os seguintes comandos para proteger arquivos sensíveis:

```bash
# Proteger pasta de memória
chmod -R 700 ~/assistente-executivo/memoria/

# Proteger .env do Telegram
chmod 600 ~/.claude/channels/telegram/.env

# Proteger scripts
chmod 700 ~/assistente-executivo/scripts/*.sh

# Proteger logs
chmod 700 ~/assistente-executivo/logs/
```

---

## 4. CONFIGURAR OS CRONS

Registrar todos os crons de uma vez:

```bash
# Criar pasta de scripts e logs
mkdir -p ~/assistente-executivo/scripts ~/assistente-executivo/logs

# Tornar scripts executáveis
chmod +x ~/assistente-executivo/scripts/*.sh

# Adicionar ao crontab
(crontab -l 2>/dev/null; echo "# Manutenção semanal - toda segunda 7h"; echo "0 7 * * 1 /home/assistente/assistente-executivo/scripts/manutencao-semanal.sh"; echo "# Check pendências - todo dia 7h"; echo "0 7 * * * /home/assistente/assistente-executivo/scripts/check-pendencias.sh") | crontab -
```

Verificar que ficou certo:
```bash
crontab -l
```

---

## 5. REGRAS DE MANUTENÇÃO PARA O CLAUDE.MD

Adicionar estas regras no CLAUDE.md do assistente para que ele saiba quando e como fazer manutenção:

```
## MANUTENÇÃO DE MEMÓRIA

### Manutenção semanal (segunda-feira, primeiro contato)
No primeiro contato de cada segunda-feira:
1. Verificar memoria/pendencias.md — reorganizar por prazo (atrasadas no topo)
2. Verificar memoria/contexto-semanal.md — remover o que não é mais relevante, máximo 1 página
3. Se memoria/aprendizados.md tiver mais de 30 entradas, consolidar similares
4. Informar: "Manutenção semanal: X pendências abertas (Y atrasadas), contexto atualizado."

### Manutenção mensal (primeira segunda do mês)
Além da semanal:
1. Verificar se algum arquivo de memória tem mais de 2000 palavras
2. Propor consolidação de aprendizados em regras permanentes
3. Verificar se preferencias.md tem informações desatualizadas
4. Informar resumo: decisões ativas, pendências, aprendizados, estado geral

### Regras invioláveis
- NUNCA deletar nada de memoria/ ou sessoes/ — sempre mover para arquivo/
- NUNCA contradizer decisão registrada sem alertar
- NUNCA repetir erro já registrado em aprendizados
- SEMPRE informar o que registrou na memória
- SEMPRE consultar decisoes.md antes de sugerir direção estratégica
- SEMPRE consultar aprendizados.md antes de rascunhar comunicações
```

---

## DEPOIS DE EXECUTAR

O assistente deve confirmar:
1. Todas as pastas foram criadas
2. Todos os scripts foram criados e têm permissão de execução
3. Crons foram registrados (mostrar saída de crontab -l)
4. Permissões de segurança foram aplicadas
5. Regras de manutenção foram anotadas para inclusão no CLAUDE.md
