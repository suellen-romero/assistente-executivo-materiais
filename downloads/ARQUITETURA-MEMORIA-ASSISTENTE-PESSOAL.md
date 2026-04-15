# ARQUITETURA DE MEMÓRIA DO ASSISTENTE PESSOAL COM IA

> Este documento define a estrutura completa de memória persistente do seu assistente pessoal que roda via Claude Code Channels no Telegram, hospedado na sua VPS. Ele cobre: estrutura de pastas, ciclo de memória (boot, consulta, registro, manutenção), regras invioláveis e templates de cada arquivo.

---

## 1. O PROBLEMA QUE A MEMÓRIA RESOLVE

Cada vez que você manda uma mensagem no Telegram, o Claude Code Channels inicia uma sessão. Quando a conversa termina (por timeout ou silêncio), a sessão morre. Tudo que aconteceu desaparece.

Sem memória persistente, o assistente:
- Não sabe que ontem você tomou uma decisão importante
- Não lembra que existe um prazo pra hoje
- Repete sugestões que já foram rejeitadas
- Não aprende com correções
- Começa toda conversa do zero

A memória persistente resolve isso usando arquivos markdown organizados em pastas na VPS. O assistente lê esses arquivos no início de cada sessão e escreve neles quando algo relevante acontece. Os arquivos sobrevivem a reinicializações, quedas e atualizações.

---

## 2. ESTRUTURA COMPLETA DE PASTAS

```
/home/assistente/assistente-executivo/
│
├── CLAUDE.md                              ← Índice inteligente. Carregado automaticamente
│                                             pelo Claude Channels em toda sessão.
│                                             Contém: resumo sobre você (1 parágrafo),
│                                             regras invioláveis, instruções de boot,
│                                             instruções de consulta, instruções de
│                                             registro, instruções de manutenção,
│                                             e o INDICE.md embutido ou referenciado.
│
├── INDICE.md                              ← Mapa semântico de todos os documentos.
│                                             Criado após padronização dos docs.
│                                             Formato: tema → arquivo → seção.
│                                             O assistente consulta ESTE arquivo para
│                                             saber onde buscar qualquer informação.
│
├── .claude/
│   ├── commands/                          ← Slash commands reais do Claude Code
│   │   │                                    Você digita /comando no Telegram e o
│   │   │                                    assistente executa o playbook correspondente.
│   │   │
│   │   ├── briefing.md                       /briefing → briefing matinal completo
│   │   ├── reuniao.md                        /reuniao → preparar reunião
│   │   ├── ata.md                            /ata → registrar ata de reunião
│   │   ├── registra.md                       /registra → forçar registro de memória
│   │   ├── pendencias.md                     /pendencias → listar pendências abertas
│   │   ├── email.md                          /email → rascunhar email
│   │   ├── decisao.md                        /decisao → registrar decisão tomada
│   │   ├── manutencao.md                     /manutencao → forçar manutenção semanal
│   │   ├── analise.md                        /analise → analisar documento/contrato/proposta
│   │   ├── feedback.md                       /feedback → montar feedback estruturado (SBI)
│   │   ├── cenario.md                        /cenario → modelar cenários (base/otimista/pessimista)
│   │   ├── comunicado.md                     /comunicado → rascunhar comunicado interno
│   │   ├── fornecedor.md                     /fornecedor → pesquisar e comparar fornecedores
│   │   ├── braindump.md                      /braindump → organizar brain dump por tema
│   │   └── report.md                         /report → gerar report semanal consolidado
│   │
│   └── settings.local.json               ← Configuração local do projeto Claude Code.
│                                             Define modelo padrão, permissões,
│                                             e outras configs específicas do projeto.
│
├── camada1-voce/                           ← CAMADA 1: Sobre Você
│   │                                         Documentos que você preenche uma vez
│   │                                         e atualiza raramente. Definem quem você
│   │                                         é como pessoa e profissional.
│   │
│   ├── quem-sou-eu.md                     ← Perfil pessoal e profissional
│   │                                         Conteúdo: dados pessoais, família,
│   │                                         perfil comportamental (MBTI, Enneagram,
│   │                                         Human Design, etc), padrões de decisão,
│   │                                         pontos fortes e fracos, como reage
│   │                                         sob pressão, o que motiva e desmotiva.
│   │                                         Frequência de atualização: raro.
│   │
│   ├── minha-historia.md                  ← Trajetória de vida e momentos-chave
│   │                                         Conteúdo: história profissional,
│   │                                         momentos decisivos, aprendizados,
│   │                                         contexto familiar, origem.
│   │                                         Frequência de atualização: raro.
│   │
│   ├── minha-metodologia.md               ← Como você pensa, decide e lidera
│   │                                         Conteúdo: frameworks de decisão,
│   │                                         estilo de liderança, como dá feedback,
│   │                                         como cobra resultados, como comunica.
│   │                                         Frequência de atualização: raro.
│   │
│   └── saude-e-rotina.md                  ← Restrições, preferências e horários
│                                             Conteúdo: rotina típica, horários
│                                             produtivos, restrições alimentares,
│                                             condições de saúde relevantes,
│                                             preferências de agenda.
│                                             Frequência de atualização: quando mudar.
│
├── camada2-empresa/                       ← CAMADA 2: Sobre a Empresa
│   │                                         Documentos sobre o negócio, time,
│   │                                         clientes e estratégia. Você preenche
│   │                                         e atualiza conforme a empresa muda.
│   │
│   ├── empresa.md                         ← O que é a empresa
│   │                                         Conteúdo: nome, CNPJ, localização,
│   │                                         história da empresa, números (faturamento,
│   │                                         funcionários, clientes), marcas do grupo,
│   │                                         modelo de negócio.
│   │                                         Frequência de atualização: trimestral.
│   │
│   ├── time.md                            ← Organograma e perfil dos líderes
│   │                                         Conteúdo: estrutura hierárquica,
│   │                                         nome/cargo/perfil de cada líder,
│   │                                         como lidar com cada um, pontos fortes
│   │                                         e fracos, dinâmicas do time.
│   │                                         Frequência de atualização: quando mudar.
│   │
│   ├── clientes.md                        ← Personas, ICP e jornada do cliente
│   │                                         Conteúdo: perfil de cliente ideal,
│   │                                         tiers de clientes, personas detalhadas,
│   │                                         jornada de compra, objeções comuns.
│   │                                         Frequência de atualização: trimestral.
│   │
│   ├── produtos.md                        ← O que vende, preços e diferenciais
│   │                                         Conteúdo: lista de produtos/serviços,
│   │                                         tabela de preços, diferenciação vs
│   │                                         concorrentes, proposta de valor.
│   │                                         Frequência de atualização: quando mudar.
│   │
│   ├── posicionamento.md                  ← Como a empresa se posiciona no mercado
│   │                                         Conteúdo: mensagem central, termos
│   │                                         proibidos, metodologia proprietária,
│   │                                         tom de voz da marca, regras de comunicação.
│   │                                         Frequência de atualização: raro.
│   │
│   ├── objetivos.md                       ← Metas do ano e prioridades
│   │                                         Conteúdo: metas anuais, OKRs,
│   │                                         prioridades do trimestre, KPIs principais.
│   │                                         Frequência de atualização: trimestral.
│   │
│   ├── planejamento.md                    ← O que está planejado e timeline
│   │                                         Conteúdo: projetos em andamento,
│   │                                         lançamentos previstos, datas importantes,
│   │                                         dependências entre projetos.
│   │                                         Frequência de atualização: mensal.
│   │
│   └── decisoes-e-alcadas.md              ← Como funciona a tomada de decisão
│                                             Conteúdo: quem aprova o quê, alçadas
│                                             por valor e tipo, fluxo de aprovação,
│                                             o que precisa de board vs direção vs líderes.
│                                             Frequência de atualização: raro.
│
├── camada3-assistente/                    ← CAMADA 3: Sobre o Assistente
│   │                                         Documentos que definem a personalidade,
│   │                                         as regras e os limites do assistente.
│   │                                         Preenchidos DEPOIS das camadas 1 e 2.
│   │
│   ├── identidade.md                      ← Nome, personalidade e tom do assistente
│   │                                         Conteúdo: nome escolhido, personalidade
│   │                                         complementar a você, tom de comunicação,
│   │                                         como se relaciona com você, limites
│   │                                         da relação (não é amigo, é assistente).
│   │                                         Frequência de atualização: raro.
│   │
│   ├── curriculo.md                       ← O que o assistente sabe fazer
│   │                                         Conteúdo: lista de habilidades,
│   │                                         ferramentas que acessa (email, calendário,
│   │                                         Whisper, web, etc), o que faz bem, o que
│   │                                         não faz, limitações conhecidas.
│   │                                         Frequência de atualização: quando
│   │                                         novas ferramentas/MCPs forem adicionados.
│   │
│   └── regras.md                          ← Guardrails, segurança e limites
│                                             Conteúdo: o que o assistente NUNCA deve
│                                             fazer, o que precisa de aprovação,
│                                             dados que não pode compartilhar,
│                                             regras de privacidade, protocolo
│                                             de erro, quando escalar pra você.
│                                             Frequência de atualização: raro.
│
├── memoria/                               ← MEMÓRIA VIVA
│   │                                         Arquivos que o assistente lê e escreve
│   │                                         ativamente. São a memória de curto
│   │                                         e médio prazo do assistente.
│   │
│   ├── decisoes.md                        ← Decisões tomadas por você
│   │                                         O assistente CONSULTA antes de fazer
│   │                                         qualquer sugestão (para não contradizer
│   │                                         decisão anterior). O assistente ESCREVE
│   │                                         quando você toma uma decisão na conversa.
│   │
│   ├── pendencias.md                      ← Compromissos e follow-ups com prazo
│   │                                         O assistente CONSULTA no boot de toda sessão.
│   │                                         O assistente ESCREVE quando fica algo pendente.
│   │                                         O assistente ATUALIZA quando algo é concluído.
│   │
│   ├── preferencias.md                    ← Preferências operacionais suas
│   │                                         Restaurante favorito, formato de relatório
│   │                                         preferido, como gosta de receber informação,
│   │                                         fornecedores recorrentes, contatos frequentes.
│   │                                         Diferente de aprendizados.md: preferencias.md
│   │                                         são fatos sobre você ("gosta de japonês no
│   │                                         restaurante X"), aprendizados.md são regras
│   │                                         de comportamento do assistente ("emails
│   │                                         máximo 3 parágrafos").
│   │
│   ├── aprendizados.md                    ← Correções e regras de comportamento aprendidas
│   │                                         O assistente CONSULTA antes de produzir
│   │                                         outputs similares a algo que já foi
│   │                                         corrigido. O assistente ESCREVE quando o
│   │                                         você corrige ou demonstra preferência
│   │                                         sobre como o assistente deve se comportar.
│   │
│   ├── contexto-semanal.md                ← O que está acontecendo agora
│   │                                         O assistente CONSULTA no boot de toda sessão.
│   │                                         O assistente ATUALIZA quando algo muda no
│   │                                         cenário. Você pode atualizar manualmente.
│   │                                         Limpo e reescrito toda segunda-feira.
│   │
│   └── arquivo/                           ← Arquivo morto da memória
│       │                                     Conteúdo removido na manutenção periódica.
│       │                                     Mantido para consulta histórica se necessário.
│       │
│       ├── pendencias-concluidas.md          Pendências marcadas como concluídas há +7 dias
│       └── decisoes-antigas.md               Decisões com mais de 90 dias (exceto "permanentes")
│
├── sessoes/                               ← LOGS DE SESSÃO
│   │                                         Resumo do que aconteceu em cada dia.
│   │                                         O assistente cria automaticamente conforme
│   │                                         as conversas acontecem. Retém últimos 7 dias.
│   │
│   └── arquivo/                           ← Sessões com mais de 7 dias
│       │                                     Movidas automaticamente na manutenção.
│       │                                     Extrair decisões/aprendizados ANTES de mover.
│       └── [arquivos antigos]
│
├── templates/                             ← MODELOS REUTILIZÁVEIS
│   │                                         Formatos padrão para documentos que você
│   │                                         usa com frequência. O assistente segue o
│   │                                         template em vez de inventar formato a cada vez.
│   │                                         Garante consistência de output.
│   │
│   ├── ata-reuniao.md                     ← Modelo: ata de reunião
│   │                                         Seções: participantes, pauta, decisões,
│   │                                         ações com responsável e prazo, próximos passos.
│   │
│   ├── comunicado-interno.md              ← Modelo: comunicado pro time
│   │                                         Variantes: mudança, resultado, diretriz,
│   │                                         crise, celebração.
│   │
│   ├── feedback-1on1.md                   ← Modelo: feedback estruturado
│   │                                         Framework SBI (Situação, Comportamento, Impacto).
│   │                                         Variantes: construtivo e reconhecimento.
│   │
│   ├── briefing-projeto.md                ← Modelo: briefing de novo projeto
│   │                                         Seções: objetivo, escopo, stakeholders,
│   │                                         timeline, riscos, definição de sucesso.
│   │
│   └── proposta-comercial.md              ← Modelo: proposta/orçamento
│                                             Seções: contexto, solução, investimento,
│                                             timeline, termos.
│
├── processos/                             ← PLAYBOOKS E SOPs
│   │                                         Roteiros passo a passo para processos
│   │                                         recorrentes. Quando o assistente tiver crons
│   │                                         automáticos, vai seguir esses playbooks.
│   │                                         Você documenta "como eu faço X" e o assistente
│   │                                         passa a replicar.
│   │
│   ├── onboarding-cliente.md              ← SOP: como onboardar um novo cliente
│   ├── fechamento-mensal.md               ← SOP: rotina de fechamento financeiro mensal
│   ├── rotina-semanal.md              ← SOP: rotina semanal padrão seu
│   │                                         (segunda=planejamento, sexta=review, etc)
│   └── checklist-viagem.md                ← SOP: preparação de viagens (docs, reservas, roteiro)
│
├── anexos/                                ← ARQUIVOS RECEBIDOS ORGANIZADOS
│   │                                         Contratos, apresentações e documentos
│   │                                         que você envia pro assistente e que precisam
│   │                                         ser retidos para consulta futura.
│   │                                         Regra de limpeza: arquivos com mais de
│   │                                         90 dias sem consulta são movidos para
│   │                                         anexos/arquivo/ na manutenção mensal.
│   │
│   ├── contratos/                         ← Contratos ativos e em negociação
│   ├── apresentacoes/                     ← Decks e apresentações relevantes
│   ├── financeiro/                        ← Relatórios financeiros, DREs, extratos
│   ├── rh/                                ← Documentos de pessoas (org chart, avaliações)
│   └── arquivo/                           ← Anexos antigos (90+ dias sem consulta)
│
└── time/                                  ← REPORTS DO TIME
    │                                         Recebe reports dos líderes e gera
    │                                         visão consolidada para você.
    │
    ├── config.md                          ← Allowlist e regras de acesso do time
    ├── reports/                           ← Reports individuais recebidos
    │   └── [YYYY-MM-DD-nome.md]
    └── panorama-semanal.md                ← Visão consolidada gerada pelo assistente
```

### Nota sobre skills vs commands

No Claude Code, skills são plugins globais instalados em `~/.claude/plugins/`. Eles ficam disponíveis para qualquer projeto. Os comandos inteligentes que você usa no dia a dia (briefing, ata, análise, feedback, etc.) funcionam como slash commands em `.claude/commands/` - são específicos do projeto do assistente, chamados diretamente por você no Telegram, e seguem um playbook definido no arquivo .md correspondente.

---

## 3. CICLO DE MEMÓRIA: AS 4 FASES

### 3.1 FASE 1 - BOOT (início de cada sessão)

**Quando acontece:** Toda vez que você manda uma mensagem no Telegram e inicia uma nova sessão.

**O que acontece automaticamente:** O Claude Channels carrega o CLAUDE.md. Isso é nativo, não precisa de configuração.

**O que o assistente deve fazer (instrução no CLAUDE.md):**

```
## BOOT OBRIGATÓRIO

Ao iniciar qualquer conversa, ANTES de responder a primeira mensagem:

1. Leia memoria/contexto-semanal.md
   → Para saber o que está acontecendo agora na vida e na empresa seu

2. Leia memoria/pendencias.md
   → Para saber se existe algo urgente, atrasado ou com prazo pra hoje

3. Se for segunda-feira E ainda não fez a manutenção semanal:
   → Execute o protocolo de manutenção (seção 3.4) antes de responder

4. Só então responda a mensagem seu

EXCEÇÃO: Se a mensagem for uma pergunta simples e rápida que claramente
não precisa de contexto ("que dia é hoje?", "converte 100 dólares pra reais"),
responda direto sem ler os arquivos de boot.
```

**Por que isso importa:** Sem o boot, o assistente responde "bom dia" sem saber que ontem você demitiu alguém, que tem uma reunião com investidor em 2 horas, ou que existe um prazo vencendo hoje.

**Custo:** Os 2 arquivos de boot (contexto-semanal + pendências) são lidos em toda sessão. Por isso precisam ser enxutos - máximo 1 página cada. Se crescerem além disso, a manutenção semanal deve limpá-los.

---

### 3.2 FASE 2 - CONSULTA (durante a conversa)

**Quando acontece:** Sempre que você pede algo que exige informação que não está no boot.

**O que o assistente deve fazer (instrução no CLAUDE.md):**

```
## CONSULTA SOB DEMANDA

Quando você pedir algo que exige contexto específico:

1. Consulte o INDICE.md para localizar o arquivo e a seção exata
2. Leia APENAS a seção necessária, não o documento inteiro
3. Se o índice aponta para um documento marcado como [GRANDE],
   leia apenas o header (##) relevante
4. Se não encontrar no índice, diga: "Não tenho essa informação
   registrada. Quer que eu pesquise ou que você me passe?"

CONSULTA DE TEMPLATES:
Quando você pedir pra criar um documento recorrente (ata, feedback,
comunicado, proposta), consulte templates/ para usar o formato padrão.
Se não existir template pro tipo de documento pedido, crie no melhor
formato possível e pergunte: "Quer que eu salve esse formato como
template pra próxima vez?"

CONSULTA DE PROCESSOS:
Quando você mencionar uma atividade que tem SOP em processos/,
siga o playbook. Se você pedir algo diferente do SOP, execute
como pedido mas pergunte: "Isso diverge do processo documentado.
Quer que eu atualize o SOP?"

EXEMPLOS DE QUANDO CONSULTAR:

Você pergunta sobre uma pessoa do time
→ INDICE.md → camada2/time.md → seção da pessoa específica

Você pede pra preparar reunião
→ .claude/commands/reuniao.md (playbook do comando)
→ + camada2/time.md se a reunião for com alguém do time

Você pede pra rascunhar email importante
→ camada1/quem-sou-eu.md → seção de comunicação
→ + memoria/aprendizados.md (pra checar se já foi corrigido em algo similar)

Você pergunta sobre estratégia ou posicionamento
→ INDICE.md → camada2/posicionamento.md → seção relevante

Você pede pra analisar um contrato recebido
→ .claude/commands/analise.md (playbook do comando)
→ + anexos/contratos/ (pra comparar com contratos anteriores se houver)

Você pede ata de reunião
→ templates/ata-reuniao.md (formato padrão)

Você pergunta sobre um processo da empresa
→ processos/ (SOP correspondente)

REGRA DE OURO: Na dúvida, consulte memoria/decisoes.md e
memoria/aprendizados.md ANTES de sugerir qualquer coisa.
Contradizer uma decisão anterior ou repetir um erro já corrigido
é a pior coisa que o assistente pode fazer.
```

---

### 3.3 FASE 3 - REGISTRO (antes de encerrar a conversa)

**Quando acontece:** No final de toda conversa ou quando algo relevante acontece durante a conversa.

**O que o assistente deve fazer (instrução no CLAUDE.md):**

```
## REGISTRO OBRIGATÓRIO

Antes de encerrar qualquer conversa, avalie TODOS os itens abaixo
e execute os que se aplicam. NÃO pergunte a você se deve registrar.
Registre automaticamente e informe o que registrou.
```

#### 3.3.1 DECISÕES TOMADAS

**QUANDO:** Você tomou, comunicou ou confirmou qualquer decisão durante a conversa.
**ONDE:** memoria/decisoes.md
**FORMATO:**
```
### [DATA] - [TÍTULO DA DECISÃO]
- **Decisão:** [o que foi decidido]
- **Contexto:** [por que foi decidido]
- **Impacto:** [o que muda a partir de agora]
- **Prazo:** [se houver]
- **Quem precisa saber:** [se alguém precisa ser comunicado]
- **Status:** Ativa | Permanente
```
**EXEMPLO:**
```
### 2026-04-13 - Cancelar contrato fornecedor de hosting
- **Decisão:** Cancelar contrato com o fornecedor atual e migrar pra alternativa
- **Contexto:** Preço subiu 40% sem aviso, suporte demorou 72h pra responder
- **Impacto:** Migrar 3 aplicações até fim de abril. Economia de R$800/mês
- **Prazo:** Migração completa até 30/04
- **Quem precisa saber:** CTO precisa planejar a migração
- **Status:** Ativa
```

#### 3.3.2 PENDÊNCIAS CRIADAS

**QUANDO:** Ficou algo pra fazer - seu, de alguém do time, ou do próprio assistente.
**ONDE:** memoria/pendencias.md
**FORMATO:**
```
- [ ] [O QUE] | Responsável: [QUEM] | Prazo: [DATA] | Criado em: [DATA] | Origem: [conversa/reunião/email]
```

#### 3.3.3 PENDÊNCIAS RESOLVIDAS

**QUANDO:** Uma pendência que estava em memoria/pendencias.md foi resolvida nesta conversa.
**ONDE:** memoria/pendencias.md (atualizar o item existente)
**AÇÃO:** Marcar com [x] e adicionar data de conclusão.
```
- [x] [O QUE] | Responsável: [QUEM] | Prazo: [DATA] | Criado em: [DATA] | Concluído em: [DATA]
```

#### 3.3.4 PREFERÊNCIAS APRENDIDAS (fatos sobre você)

**QUANDO:** Você mencionou uma preferência pessoal, um contato recorrente, um fornecedor favorito, uma restrição, ou qualquer fato que o assistente deve lembrar.
**ONDE:** memoria/preferencias.md
**FORMATO:**
```
### [CATEGORIA]
- [FATO]
```
**CATEGORIAS:** Alimentação, Viagem, Fornecedores, Contatos, Agenda, Pessoal
**EXEMPLO:**
```
### Alimentação
- Restaurante japonês favorito pra jantar de negócios: Sushi Isao, pedir mesa reservada

### Fornecedores
- Gráfica preferida: PrintMax (contato: Carlos, 19-99999-0000), entrega em 48h
```
**DIFERENÇA DE APRENDIZADOS:** Preferências são fatos sobre você. Aprendizados são regras de comportamento do assistente.

#### 3.3.5 CORREÇÕES E APRENDIZADOS (regras de comportamento do assistente)

**QUANDO:** Você corrigiu o assistente, rejeitou uma sugestão, pediu pra refazer de outro jeito, ou demonstrou preferência clara sobre formato, tom, ou conteúdo.
**ONDE:** memoria/aprendizados.md
**FORMATO:**
```
### [DATA] - [CATEGORIA]
- **Situação:** [o que aconteceu]
- **O que aprendi:** [a preferência ou correção]
- **Regra para o futuro:** [como agir da próxima vez]
```
**CATEGORIAS:** Comunicação, Análise, Formato, Tom, Reuniões, Emails, Decisões, Pessoal
**EXEMPLO:**
```
### 2026-04-13 - Comunicação
- **Situação:** Rascunhei email de 8 parágrafos pro investidor. Você cortou pra 3.
- **O que aprendi:** Você prefere emails curtos e diretos, especialmente pra stakeholders seniores
- **Regra para o futuro:** Limitar emails a 3-4 parágrafos. Se precisar de mais, sugerir anexo.
```

#### 3.3.6 MUDANÇA DE CONTEXTO

**QUANDO:** Algo mudou no cenário da empresa, do time, de um projeto, ou na vida pessoal seu que é relevante pras próximas conversas.
**ONDE:** memoria/contexto-semanal.md (adicionar ou atualizar)
**EXEMPLOS de quando atualizar:**
- Reunião importante marcada ou cancelada
- Membro do time saiu, entrou ou mudou de função
- Projeto mudou de status (começou, pausou, cancelou)
- Meta foi batida ou mudou
- Evento pessoal relevante (viagem, compromisso)

#### 3.3.7 ANEXOS RECEBIDOS

**QUANDO:** Você enviar um arquivo (contrato, apresentação, relatório, planilha) que pode ser consultado no futuro.
**ONDE:** anexos/ na subpasta correspondente (contratos/, apresentacoes/, financeiro/, rh/)
**AÇÃO:** Salvar o arquivo com nome descritivo no formato `YYYY-MM-DD-descricao.ext`
**EXEMPLO:** `anexos/contratos/2026-04-13-contrato-fornecedor-hosting.pdf`
**REGRA:** Sempre informar a você onde salvou: "Salvei o contrato em anexos/contratos/."

#### 3.3.8 NOVOS TEMPLATES

**QUANDO:** Você pediu pra criar um tipo de documento que não tem template em templates/, e o resultado ficou bom.
**ONDE:** templates/ com nome descritivo
**AÇÃO:** Perguntar: "Ficou bom o formato. Quer que eu salve como template pra próxima vez?"
**REGRA:** Só salvar se você aprovar.

#### 3.3.9 ATUALIZAÇÃO DE PROCESSOS

**QUANDO:** Você descreveu ou executou um processo recorrente que não está documentado em processos/, ou que divergiu de um SOP existente.
**ONDE:** processos/ (criar novo ou atualizar existente)
**AÇÃO:** Perguntar: "Isso parece um processo recorrente. Quer que eu documente como SOP?"
**REGRA:** Só criar/atualizar se você aprovar.

#### 3.3.10 NADA RELEVANTE ACONTECEU

Se a conversa foi simples e rápida (pergunta factual, cálculo, consulta rápida), NÃO registre nada. Nem toda conversa merece registro.
**EXEMPLOS de conversas que NÃO geram registro:**
- "Que horas é a reunião de amanhã?"
- "Converte 5000 USD pra BRL"
- "Qual o telefone do fulano?"
- "Resume esse PDF pra mim"

#### 3.3.11 LOG DA SESSÃO

**QUANDO:** A conversa teve mais de 5 trocas de mensagem OU envolveu algum registro dos itens acima.
**ONDE:** sessoes/YYYY-MM-DD.md (criar ou adicionar ao existente do dia)
**FORMATO:**
```
## Sessão [HH:MM]
- **Assuntos:** [lista dos temas tratados]
- **Registros feitos:** [lista do que foi salvo em qual arquivo]
- **Resumo:** [2-3 frases sobre o que aconteceu]
```

#### 3.3.12 COMO INFORMAR Você

Após registrar, informe de forma concisa no final da resposta:
```
"Registrei: [decisão sobre X em decisoes.md] [pendência Y em pendencias.md]"
```
NÃO peça permissão. NÃO explique longamente. Apenas informe o que foi salvo.

---

### 3.4 FASE 4 - MANUTENÇÃO (periódica)

**Quando acontece:** Toda segunda-feira, no primeiro contato da semana. Ou quando você mandar /manutencao.

#### Manutenção semanal (toda segunda-feira)

```
## MANUTENÇÃO SEMANAL

No primeiro contato de cada segunda-feira, ANTES de responder:

### Passo 1: Limpar pendências
1. Abra memoria/pendencias.md
2. Mova itens marcados com [x] há mais de 7 dias para memoria/arquivo/pendencias-concluidas.md
3. Identifique pendências ATRASADAS (prazo já passou e ainda abertas)
4. Reorganize: mova itens entre as seções (Atrasadas / Esta semana / Próximas semanas / Sem prazo)
5. Conte: X abertas, Y atrasadas, Z concluídas e arquivadas

### Passo 2: Atualizar contexto semanal
1. Abra memoria/contexto-semanal.md
2. Remova informações que não são mais relevantes (eventos que já passaram, contextos resolvidos)
3. Mantenha apenas o que ainda é relevante para esta semana
4. Adicione contexto novo se houver
5. Verifique se o arquivo está dentro do limite de 1 página. Se não, condensar.

### Passo 3: Revisar aprendizados
1. Abra memoria/aprendizados.md
2. Se tiver mais de 30 entradas, consolide as similares
3. Remova aprendizados que já viraram regra no CLAUDE.md (para não duplicar)

### Passo 4: Rotacionar sessões
1. Mova sessões com mais de 7 dias para sessoes/arquivo/
2. ANTES de mover, leia cada sessão antiga e verifique se há alguma decisão
   ou aprendizado que não foi registrado nos arquivos corretos
3. Se encontrar algo não registrado, registre agora antes de arquivar

### Passo 5: Verificar decisões
1. Abra memoria/decisoes.md
2. Mova decisões com mais de 90 dias para memoria/arquivo/decisoes-antigas.md
3. EXCEÇÃO: decisões marcadas como "Permanente" nunca são movidas

### Passo 6: Informar você
Envie um resumo curto:

"Manutenção semanal concluída:
- Pendências: X abertas (Y atrasadas), Z arquivadas
- Contexto semanal atualizado
- N sessões arquivadas
- Memória limpa e organizada"

Se houver pendências atrasadas, listar quais são.
```

#### Manutenção mensal (primeira segunda-feira do mês)

```
## MANUTENÇÃO MENSAL

Além da manutenção semanal, na primeira segunda do mês:

### Passo 1: Auditoria geral
1. Contar total de registros em cada arquivo de memória
2. Verificar se algum arquivo está grande demais (>2000 palavras)

### Passo 2: Consolidar aprendizados
1. Se memoria/aprendizados.md tiver aprendizados repetidos ou que se tornaram
   padrão consistente, propor a você: "Tenho N aprendizados registrados. Estes
   parecem regras consolidadas que podem ir pro CLAUDE.md: [lista]. Aprova?"
2. Se aprovado, mover para o CLAUDE.md e remover de aprendizados.md

### Passo 3: Consolidar preferências
1. Verificar se memoria/preferencias.md tem informações desatualizadas
2. Perguntar a você se alguma preferência mudou

### Passo 4: Limpar anexos
1. Identificar arquivos em anexos/ que não foram consultados nos últimos 90 dias
2. Mover para anexos/arquivo/ com log: "Arquivei N anexos antigos. Se precisar
   de algum, estão em anexos/arquivo/."
3. NUNCA deletar — apenas mover para arquivo/

### Passo 5: Verificar templates e processos
1. Listar templates em templates/ e perguntar: "Algum desses modelos precisa
   de ajuste?"
2. Listar SOPs em processos/ e perguntar: "Algum processo mudou?"

### Passo 6: Relatório mensal
Enviar resumo a você:

"Relatório mensal da memória:
- Decisões ativas: N (N permanentes)
- Pendências abertas: N (N atrasadas)
- Aprendizados: N (N candidatos a virar regra)
- Preferências registradas: N
- Sessões no arquivo: N
- Anexos: N ativos, N arquivados
- Templates: N | Processos: N
- Próxima manutenção mensal: [data]"
```

---

## 4. REGRAS INVIOLÁVEIS DE MEMÓRIA

```
## REGRAS QUE NUNCA PODEM SER QUEBRADAS

1. NUNCA contradizer uma decisão registrada em memoria/decisoes.md
   sem alertar você: "Isso contradiz a decisão de [data] sobre [tema].
   Quer revisar?"

2. NUNCA repetir um erro já registrado em memoria/aprendizados.md.
   Antes de produzir qualquer output (email, análise, sugestão),
   consultar aprendizados relevantes.

3. NUNCA deixar de registrar uma decisão. Se você disse "decidi",
   "vou fazer", "fechado", "aprovado", "cancelado", "mudou" — é decisão.
   Registre.

4. NUNCA modificar ou deletar documentos das camadas 1, 2 e 3
   sem autorização explícita seu. Esses são docs de referência,
   não de trabalho.

5. NUNCA compartilhar conteúdo de documentos marcados como CONFIDENCIAL
   em mensagens, emails ou comunicações externas.

6. NUNCA acumular mais de 50 pendências abertas sem alertar:
   "Você tem 50+ pendências abertas. Quer revisar e limpar?"

7. NUNCA acumular mais de 14 dias de sessões sem rotacionar.

8. NUNCA deletar nada de memoria/ ou sessoes/. Sempre MOVER para arquivo/.

9. NUNCA criar ou atualizar templates ou processos sem aprovação seu.

10. NUNCA salvar anexos fora da estrutura de pastas de anexos/.
    Tudo que você enviar vai pra subpasta correspondente.

11. SEMPRE informar o que registrou. Você precisa saber o que está
    sendo salvo na memória dele.

12. SEMPRE consultar memoria/decisoes.md antes de sugerir direção
    estratégica, mudança de fornecedor, contratação, ou qualquer
    decisão que possa contradizer algo já decidido.

13. SEMPRE consultar memoria/aprendizados.md antes de rascunhar
    emails, feedbacks, ou comunicações — pra aplicar o tom e formato
    que você já mostrou que prefere.

14. SEMPRE consultar templates/ antes de criar documento recorrente.
    Usar o formato padrão. Se não existir, perguntar se deve criar.

15. SEMPRE seguir processos/ quando executar atividade que tem SOP.
    Se divergir, alertar e perguntar se atualiza.
```

---

## 5. TEMPLATES DOS ARQUIVOS DE MEMÓRIA

### 5.1 memoria/decisoes.md

```markdown
# DECISÕES ATIVAS

> Decisões tomadas por você que ainda estão em vigor.
> O assistente DEVE consultar este arquivo antes de fazer qualquer sugestão
> que possa contradizer uma decisão existente.
> Decisões com mais de 90 dias são movidas para arquivo/decisoes-antigas.md
> na manutenção mensal, exceto as marcadas como "Permanente".

---

[vazio — o assistente preenche conforme decisões são tomadas]
```

### 5.2 memoria/pendencias.md

```markdown
# PENDÊNCIAS ATIVAS

> Compromissos, tarefas e follow-ups com prazo.
> O assistente lê este arquivo no BOOT de toda sessão.
> Reorganizado automaticamente na manutenção semanal.
> Itens concluídos há +7 dias são movidos para arquivo/pendencias-concluidas.md.

---

## Atrasadas


## Esta semana


## Próximas semanas


## Sem prazo definido

```

### 5.3 memoria/preferencias.md

```markdown
# PREFERÊNCIAS DVocê

> Fatos sobre gostos, contatos recorrentes, fornecedores favoritos,
> restrições e preferências pessoais seu.
> Diferente de aprendizados.md: aqui são FATOS sobre você,
> não regras de comportamento do assistente.

---

## Alimentação


## Viagem


## Fornecedores


## Contatos Frequentes


## Agenda e Rotina


## Pessoal

```

### 5.4 memoria/aprendizados.md

```markdown
# APRENDIZADOS E REGRAS DE COMPORTAMENTO

> Correções, preferências e padrões aprendidos nas conversas.
> O assistente DEVE consultar antes de produzir outputs similares
> a algo já corrigido.
> Quando um aprendizado se consolida como regra permanente, é promovido
> para o CLAUDE.md na manutenção mensal.

---

## Comunicação


## Análise


## Formato


## Tom


## Reuniões


## Emails


## Pessoal

```

### 5.5 memoria/contexto-semanal.md

```markdown
# CONTEXTO DA SEMANA — [DATA INÍCIO] a [DATA FIM]

> O que está acontecendo agora na empresa e na vida seu.
> O assistente lê este arquivo no BOOT de toda sessão.
> Limpo e reescrito toda segunda-feira na manutenção semanal.
> MÁXIMO 1 PÁGINA. Se passar disso, condensar.

---

## Prioridades da semana


## Agenda importante


## Projetos em andamento


## Alertas


## Pessoal

```

### 5.6 sessoes/YYYY-MM-DD.md

```markdown
# SESSÕES DE [DATA]

> Resumo das conversas do dia. Criado automaticamente pelo assistente.
> Retido por 7 dias, depois movido para sessoes/arquivo/.
> Extrair decisões e aprendizados ANTES de arquivar.

---

## Sessão [HH:MM]
- **Assuntos:** [lista dos temas tratados]
- **Registros feitos:** [lista do que foi salvo em qual arquivo]
- **Resumo:** [2-3 frases sobre o que aconteceu]
```

---

## 6. IMPLEMENTAÇÃO

### Ordem de execução:

1. **Criar a estrutura de pastas** na VPS exatamente como descrito na seção 2
2. **Criar os templates vazios** de cada arquivo de memória (seção 5)
3. **Padronizar os documentos existentes** com headers consistentes (documento de padronização separado)
4. **Distribuir os documentos padronizados** nas pastas corretas (camada1/, camada2/, camada3/)
5. **Criar os templates em templates/** (ata, comunicado, feedback, briefing, proposta)
6. **Criar os SOPs iniciais em processos/** (rotina semanal seu como primeiro SOP)
7. **Montar o INDICE.md** com o mapa semântico de todos os documentos (incluindo templates e processos)
8. **Montar o CLAUDE.md** com: resumo seu, regras invioláveis, instruções de boot, consulta, registro e manutenção, e referência ao INDICE.md
9. **Testar o ciclo completo**: executar os 9 testes da seção 7

### Comando para criar a estrutura na VPS:

```bash
cd /home/assistente/assistente-executivo/

# Estrutura principal
mkdir -p camada1-voce
mkdir -p camada2-empresa
mkdir -p camada3-assistente
mkdir -p memoria/arquivo
mkdir -p sessoes/arquivo
mkdir -p templates
mkdir -p processos
mkdir -p anexos/contratos
mkdir -p anexos/apresentacoes
mkdir -p anexos/financeiro
mkdir -p anexos/rh
mkdir -p anexos/arquivo
mkdir -p time/reports
mkdir -p .claude/commands

# Criar arquivos de memória com templates
touch memoria/decisoes.md
touch memoria/pendencias.md
touch memoria/preferencias.md
touch memoria/aprendizados.md
touch memoria/contexto-semanal.md
touch memoria/arquivo/pendencias-concluidas.md
touch memoria/arquivo/decisoes-antigas.md

# Criar arquivos do time
touch time/config.md
touch time/panorama-semanal.md

# Criar INDICE.md
touch INDICE.md
```

---

## 7. VALIDAÇÃO: COMO SABER SE A MEMÓRIA ESTÁ FUNCIONANDO

### Teste 1: Boot
Mande "bom dia" no Telegram. O assistente deve mencionar algo do contexto-semanal ou alguma pendência. Se responder um "bom dia" genérico, o boot não está funcionando.

### Teste 2: Registro de decisão
Diga "decidi cancelar a reunião de quinta com o fornecedor X". Depois feche a conversa. Abra o arquivo memoria/decisoes.md na VPS. A decisão deve estar lá.

### Teste 3: Persistência entre sessões
Espere 1 hora. Mande nova mensagem: "que decisões eu tomei hoje?". O assistente deve consultar memoria/decisoes.md e listar a decisão do teste 2.

### Teste 4: Aprendizado
Peça pro assistente rascunhar um email. Corrija: "muito longo, quero 3 parágrafos no máximo". Feche a conversa. No dia seguinte, peça outro email. Deve vir com 3 parágrafos sem você pedir.

### Teste 5: Manutenção
Envie /manutencao. O assistente deve executar os passos da manutenção semanal e informar o resultado.

### Teste 6: Contradição
Registre uma decisão: "decidi que todo email pra investidor passa pela revisão do meu sócio antes de enviar". Depois peça: "rascunha e envia esse email pro investidor Y". O assistente deve alertar que existe uma decisão sobre revisão prévia de emails pra investidor.

### Teste 7: Preferência vs Aprendizado
Diga "meu restaurante favorito pra negócios é o Sushi Isao". Verifique se salvou em memoria/preferencias.md (não em aprendizados.md). Depois corrija o tom de um email. Verifique se salvou em memoria/aprendizados.md (não em preferencias.md).

### Teste 8: Template
Peça "faz uma ata da reunião de hoje". O assistente deve consultar templates/ata-reuniao.md e seguir o formato padrão.

### Teste 9: Anexo
Envie um PDF de contrato. O assistente deve salvar em anexos/contratos/ com nome no formato YYYY-MM-DD-descricao.pdf e informar onde salvou.
