# CitizenTech — app (SmartRoad)

App React Native (Expo + TypeScript + Expo Router) para o cidadão registrar e acompanhar problemas na rua, como buracos, bueiros quebrados e iluminação. GS 2026.2 — Mobile Development & IoT.

## Ficha da CitizenTech
> **PREENCHER:** cole aqui a Ficha da CitizenTech da equipe (o PDF da GS não traz a Ficha).

## Integrantes
| Nome | RM |
| --- | --- |
| _PREENCHER_ | _PREENCHER_ |

## Como rodar
```bash
cd app
npm install
npx expo start
```
Abra no **Expo Go** (leia o QR code) ou no emulador (`a` para Android, `i` para iOS). Não precisa de `.env`, conta ou chave, porque o app não usa serviços em nuvem.

## Telas (Expo Router)
- **Início** (`src/app/(tabs)/index.tsx`): mapa ilustrativo, busca e filtro por tipo, lista de ocorrências.
- **Registrar** (`src/app/(tabs)/nova.tsx`): formulário que salva a ocorrência no banco.
- **Histórico** (`src/app/(tabs)/historico.tsx`): ocorrências registradas pelo usuário.
- **Detalhe** (`src/app/ocorrencia/[id].tsx`): dados, andamento e comentários.

## Banco de dados: SQLite (`expo-sqlite`)
Escolhido porque é local, gratuito, funciona sem internet e não exige conta nem chave, então qualquer pessoa roda o app com um comando. Tabelas `ocorrencias` e `comentarios`, acessadas só por `src/services/db.ts`.

## De onde vêm os dados
Dados **simulados (mock)** em `src/services/ocorrencias.ts`, com endereços e coordenadas fictícios. Não há dados pessoais reais. O mock simula a espera da rede (loading), e o botão "Simular erro de conexão" na tela Início mostra o estado de erro. As ocorrências que o usuário registra ficam no SQLite do aparelho.

## Estrutura
```
src/app/         telas e navegação (Expo Router)
src/components/  componentes reutilizáveis
src/services/    mock de dados e camada do banco
src/hooks/       useCarregar (loading, erro, recarregar)
src/theme.ts     cores, fontes, espaçamentos (tema centralizado)
```

## Acessibilidade
Fontes de 14 a 24, textos principais com contraste acima de 7:1, áreas de toque de pelo menos 48 px, `accessibilityLabel`/`accessibilityRole` nos botões e campos, mensagens de erro anunciadas por leitor de tela e linguagem simples.

## Prints
> **PREENCHER:** adicione os prints das telas principais.

## Vídeo (até 3 min)
> **PREENCHER:** link do YouTube (não listado).
