# CitizenTech — SmartRoad

App React Native (Expo + TypeScript + Expo Router) para o cidadão **registrar e acompanhar problemas na rua**, como buracos, bueiros quebrados, falta de iluminação e calçadas danificadas. Projeto da Global Solution 2026.2 — Mobile Development & IoT.

## Ficha da CitizenTech

> **Rascunho para conferir com a equipe e o professor.** O enunciado da GS não traz o modelo da Ficha.

| Item | Descrição |
| --- | --- |
| **Nome** | CitizenTech — SmartRoad |
| **Problema** | Buracos, bueiros quebrados e outros problemas urbanos demoram a ser resolvidos, e o morador não tem um jeito simples de avisar nem de saber em que pé está o reparo. |
| **Para quem** | Moradores da cidade, inclusive pessoas com baixa visão e usuários de leitor de tela. |
| **Solução** | Um app que mostra as ocorrências num mapa e numa lista, deixa o cidadão registrar um problema em menos de 1 minuto e acompanhar o andamento e os comentários. |
| **Jornada principal** | Início (ver ocorrências) → Registrar (avisar um problema) → Histórico (ver o que registrei) → Detalhe (andamento e comentários). |
| **Dados** | Simulados (mock), sem dados pessoais reais. |
| **Acessibilidade** | Letras legíveis, bom contraste, áreas de toque grandes, linguagem simples e suporte a leitor de tela. |

## Integrantes

| Nome | RM |
| --- | --- |
| Gustavo Viega Lopes Martins | RM555885 |
| Gustavo Yuji Osugi | RM555034 |
| Kaio Drago Lima Souza | RM556095 |
| Otávio Santos de Lima Ferrão | RM556452 |
| Vitor Rivas Cardoso | RM556404 |

## Como rodar o app

Precisa de Node 20 ou mais novo e do app **Expo Go** no celular (ou um emulador Android/iOS).

```bash
cd app
npm install
npx expo start
```

Leia o QR code com o Expo Go. No emulador, aperte `a` (Android) ou `i` (iOS). O celular precisa de internet para carregar as ocorrências de exemplo.

Também há um APK pronto na aba **Releases** do repositório.

## Telas (Expo Router)

| Tela | Arquivo | O que faz |
| --- | --- | --- |
| Início | `app/src/app/(tabs)/index.tsx` | Mapa ilustrativo, busca, filtro por tipo e lista de ocorrências |
| Registrar | `app/src/app/(tabs)/nova.tsx` | Formulário que salva a ocorrência no banco |
| Histórico | `app/src/app/(tabs)/historico.tsx` | Ocorrências que o usuário registrou |
| Detalhe | `app/src/app/ocorrencia/[id].tsx` | Dados, andamento e comentários |

## Banco de dados: SQLite (`expo-sqlite`)

Escolhemos o **SQLite local** porque é gratuito, funciona sem internet depois de instalado, não pede conta nem chave e roda no Expo Go. Qualquer pessoa executa o app com um comando. As tabelas são `ocorrencias` (o que o cidadão registra) e `comentarios`, e todo o acesso passa por `app/src/services/db.ts`. Fechar e abrir o app mantém os dados.

## De onde vêm os dados

- **Ocorrências da cidade:** mock em `app/mock/ocorrencias.json`, com endereços, datas e coordenadas **fictícios**. O app busca esse arquivo com `fetch` (`app/src/services/api.ts`) na URL raw do GitHub e trata **carregando**, **erro** (com botão "Tentar de novo") e **lista vazia**. O botão "Simular erro de conexão" na tela Início mostra o estado de erro.
- **Ocorrências do usuário e comentários:** salvos no SQLite do aparelho.
- Não há dados pessoais reais em nenhum ponto.

## Configuração (`.env`, opcional)

O app **não usa chaves, senhas nem serviços em nuvem**, então não precisa de `.env` para rodar. Só se quiser apontar para outro JSON de exemplo:

```bash
cd app
cp .env.example .env
# edite EXPO_PUBLIC_API_URL com a URL do seu JSON
```

O `.env` está no `.gitignore` e nunca vai para o repositório.

## Estrutura

```
app/
  mock/            JSON com as ocorrências de exemplo
  src/app/         telas e navegação (Expo Router)
  src/components/  componentes reutilizáveis
  src/services/    api.ts (fetch), ocorrencias.ts (dados), db.ts (SQLite)
  src/hooks/       useCarregar (loading, erro e recarregar)
  src/theme.ts     cores, fontes, espaçamentos e tamanhos (tema centralizado)
```

## Acessibilidade

- Fontes de 14 a 24 e texto principal com contraste acima de 7:1.
- Áreas de toque de pelo menos 48 px.
- `accessibilityLabel` e `accessibilityRole` em botões, abas, campos e pontos do mapa.
- Erros anunciados por leitor de tela e linguagem simples.

## Prints das telas

> **PREENCHER:** coloque os prints em `docs/prints/` e referencie aqui.

| Início | Registrar | Histórico | Detalhe |
| --- | --- | --- | --- |
| _print_ | _print_ | _print_ | _print_ |

## Vídeo (até 3 minutos)

> **PREENCHER:** link do YouTube (não listado) mostrando o app rodando, a jornada completa e os dados sendo salvos e recuperados.

## Observação

A pasta `src/` na raiz é um protótipo web feito no Lovable. A entrega da GS é o app em `app/`.
