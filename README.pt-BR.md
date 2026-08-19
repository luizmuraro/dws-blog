# DWS Blog

<p>
  <a href="README.md"><img src="https://flagcdn.com/64x48/us.png" width="32" height="24" alt="English" title="English"></a>
  &nbsp;
  <a href="README.pt-BR.md"><img src="https://flagcdn.com/64x48/br.png" width="32" height="24" alt="Português (Brasil)" title="Português (Brasil)"></a>
</p>

Front end de um blog feito para o teste técnico da DWS: uma listagem de posts com busca, filtros e
ordenação, uma página de post e favoritos que sobrevivem a um reload.

**Aplicação:** https://dws-blog-omega.vercel.app

**Storybook:** https://dws-blog-storybook.vercel.app

## Telas

### Mobile

| Listagem                                                                                                            | Página do post                                                                                                          | Últimos artigos                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| <img src="docs/screenshots/home-mobile.jpg" alt="Listagem mobile com as abas e os chips de filtro acima dos cards"> | <img src="docs/screenshots/detail-top-mobile.jpg" alt="Página do post no mobile, com o botão de voltar e a assinatura"> | <img src="docs/screenshots/detail-bottom-mobile.jpg" alt="Seção de últimos artigos no mobile, empilhada em uma coluna"> |

### Desktop

| Listagem                                                                                                          | Página do post                                                                                                        | Últimos artigos                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| <img src="docs/screenshots/home-desktop.jpg" alt="Listagem de posts com a sidebar de filtros e a grade de cards"> | <img src="docs/screenshots/detail-top-desktop.jpg" alt="Topo do post, com o título, a assinatura e a imagem de capa"> | <img src="docs/screenshots/detail-bottom-desktop.jpg" alt="Fim do post, seguido pela seção de últimos artigos"> |

## Stack

| Assunto                 | Escolha                                             |
| ----------------------- | --------------------------------------------------- |
| Framework               | React 19 + TypeScript, com Vite                     |
| Rotas                   | React Router 7 (`createBrowserRouter`)              |
| Estado global           | Redux Toolkit + React Redux                         |
| Estilos                 | SCSS modules sobre uma camada de tokens, sem UI kit |
| Testes                  | Vitest + Testing Library (jsdom)                    |
| Catálogo de componentes | Storybook 10                                        |

## Como rodar

Requer Node 20.19+ (ou 22.12+) e npm.

```bash
npm install
cp .env.example .env
npm start
```

A aplicação sobe em http://localhost:5173.

### Variáveis de ambiente

| Variável            | Padrão                                   | Para que serve           |
| ------------------- | ---------------------------------------- | ------------------------ |
| `VITE_API_BASE_URL` | `https://tech-test-backend.dwsbrazil.io` | URL base da API de posts |

O padrão já está no cliente de API, então a aplicação também roda sem um `.env`.

## Scripts

| Script                    | O que faz                                            |
| ------------------------- | ---------------------------------------------------- |
| `npm run dev`             | Servidor de desenvolvimento do Vite, com HMR         |
| `npm run build`           | Checa os tipos e gera o build em `dist/`             |
| `npm run preview`         | Serve o build de produção localmente                 |
| `npm test`                | Roda a suíte de testes uma vez                       |
| `npm run test:watch`      | Re-roda os testes a cada alteração                   |
| `npm run test:coverage`   | Roda a suíte com relatório de cobertura e thresholds |
| `npm run storybook`       | Catálogo de componentes em http://localhost:6006     |
| `npm run build-storybook` | Catálogo estático em `storybook-static/`             |
| `npm run lint`            | ESLint no projeto inteiro                            |
| `npm run format`          | Prettier escrevendo; `format:check` apenas verifica  |

## API

| Endpoint      | Usado para                                                                     |
| ------------- | ------------------------------------------------------------------------------ |
| `/posts`      | A listagem, o índice da busca e a seção "Últimos artigos"                      |
| `/posts/{id}` | A página do post — um 404 vira `null`, qualquer outro status lança erro        |
| `/categories` | Os chips de categoria que o painel de busca oferece antes de existir uma query |

As respostas são convertidas para os tipos de domínio na borda (`src/api/mappers.ts`), então nenhum
componente lê um payload da API diretamente.

## Além do que foi pedido

O teste pede duas telas, alguma forma de gerenciamento de estado para as interações do usuário e
oferece testes unitários como bônus. Estes itens foram acrescentados a esse escopo:

**Favoritos.** Uma estrela em cada card e no artigo, um filtro de "somente favoritos" com o contador
e uma aba "Favoritos" no mobile. A lista é escrita a partir da listagem e da página do post e
sobrevive a um reload via `localStorage`. É a interação que justifica a store.

**Uma busca que lembra.** Além de casar termos, o painel abre antes de qualquer coisa ser digitada
com as cinco últimas buscas e a lista completa de categorias, então um campo vazio ainda oferece
algum caminho. Os termos recentes persistem entre sessões, um termo repetido volta para o topo em vez
de se acumular, e os trechos que casam são destacados nos resultados.

**Estado compartilhável.** O termo da busca e o chip de categoria vão para a URL (`?q=`,
`?category=`), então uma listagem filtrada pode ser enviada por link e o botão de voltar se comporta.

**Todos os estados da tela, não só o feliz.** Skeletons de carregamento por componente, estado de
erro com "tentar de novo", estados vazios escritos conforme o que esvaziou a lista (nenhum
resultado, nenhum favorito ainda, favoritos filtrados), um "Post não encontrado" separado de uma
requisição que falhou, uma rota 404 e um error boundary de rota.

**Acessibilidade.** Landmarks e headings no lugar de containers genéricos, nome acessível em todo
botão de ícone, `aria-busy` e uma live region enquanto os resultados carregam, controle de foco e
teclado nos dropdowns e no painel de busca, e `prefers-reduced-motion` respeitado pelos skeletons. Os
testes verificam por role e nome acessível, e o addon `a11y` roda o axe em todas as stories.

**Ferramental.** Storybook publicado como catálogo, um pipeline de CI rodando lint, formatação,
thresholds de cobertura e os dois builds, e um deploy de preview por pull request.

## Testes

458 testes em 58 arquivos, cobrindo os utilitários, a camada de API, a store, todos os hooks, todos
os componentes e as duas páginas.

| Métrica    | Cobertura |
| ---------- | --------- |
| Statements | 99,57%    |
| Branches   | 97,38%    |
| Functions  | 100%      |
| Lines      | 100%      |

`npm run test:coverage` exige 95% de statements, lines e functions, e 90% de branches.

Os testes ficam ao lado do código que cobrem (`src/utils/date.ts` → `src/utils/date.test.ts`). Os
helpers compartilhados vivem em `src/test/`:

- `factories.ts` — builders para os tipos de domínio e da API, com datas fixas para que as
  verificações de formatação e ordenação sejam determinísticas. As stories reaproveitam os mesmos.
- `renderWithProviders.tsx` — renderiza dentro de uma store nova e de um memory router, e aceita
  `preloadedState`, `initialEntries` e um `path` de rota para componentes que leem parâmetros.
- `mockFetch.ts` — stubs de `fetch` para a camada de API. Não há mock server; nada na suíte toca a
  rede.

As verificações passam por roles e nomes acessíveis em vez de classes de CSS modules, que resolvem
para `undefined` no Vitest.

## Storybook

O catálogo publicado fica em https://dws-blog-storybook.vercel.app, redeployado pela CI a cada push
na `main`.

`npm run storybook` abre um catálogo de 80 stories em 22 arquivos. Decorators globais fornecem uma
store Redux e um memory router por story, então componentes conectados à store funcionam sem setup
individual; `parameters.preloadedState` e `parameters.route` alimentam um ou outro. O addon `a11y`
roda o axe em todas as stories.

O canvas usa por padrão o fundo real das páginas (`--color-neutral-lightest`), com branco e o azul da
marca disponíveis na toolbar.

## Estrutura do projeto

```
src/
├── api/          Cliente de fetch, endpoints e mappers API→domínio
├── components/
│   ├── features/ Componentes de uma única feature (busca, filtros, artigo, latest)
│   ├── icons/    Componentes SVG
│   ├── layout/   Layout raiz, header, decoração de fundo
│   └── ui/       Blocos compartilhados entre features (card, tags, estados)
├── constants/    Conjuntos fechados de opções (ordenação, variantes)
├── hooks/        Busca de dados, filtros, pesquisa e medição de DOM
├── pages/        Componentes de rota
├── store/        Slices do Redux, selectors e a fábrica da store
├── styles/       Tokens, reset, tipografia, mixins
├── test/         Helpers usados só em teste
├── types/        Tipos da API e do domínio
└── utils/        Funções puras
```

## Decisões de arquitetura

**As opções de filtro vêm dos posts, não dos endpoints próprios.** `/posts` já traz o autor e as
categorias embutidos, então os filtros de categoria e autor são extraídos da listagem carregada. Isso
economiza duas requisições e garante que um filtro nunca ofereça um valor que retornaria vazio.
Portanto `/authors` nunca é chamado, e seu client foi removido em vez de ficar como superfície
morta. `/categories` permanece, porque é ele que preenche os chips do painel de busca: eles são
necessários antes de qualquer coisa ser digitada, e adiar um fetch inteiro de `/posts` para
preencher seis chips é a troca mais cara.

**A busca casa em memória.** A API não tem parâmetro de query, então a listagem é buscada uma vez na
primeira consulta e cada tecla seguinte é comparada localmente com o título, o nome do autor e os
nomes das categorias. A requisição é adiada até o leitor realmente digitar, então o header não
adiciona nenhuma chamada ao carregamento da página. Um debounce de 300 ms fica entre o termo digitado
e o termo comparado — com os dados já em memória, o que ele economiza é um re-filtro por tecla, não
uma requisição. Os acentos são normalizados na comparação, mas não no destaque, onde normalizar
deslocaria os offsets dos trechos em relação ao texto original.

**A URL é dona do que vale a pena compartilhar.** O termo da busca vive em `?q=` e um chip de
categoria grava `?category=<nome>`. Os dois são lidos pelo `usePostFilters` como sementes, não como
binding: uma vez aberta a listagem, a barra de filtros e a sidebar são donas da seleção, e nada
reescreve a URL por trás do leitor.

**Favoritos são globais, filtros não.** Os favoritos são escritos a partir da listagem e da página do
post, lidos pelas duas mais a camada de filtros, e sobrevivem à página — é para isso que a store
existe. As buscas recentes são globais pelo mesmo motivo: escritas pelo header e lidas de volta por
ele entre rotas e sessões. Já as seleções de categoria, autor e ordenação são consumidas por uma
página e dois filhos diretos dela, então ficam locais no `usePostFilters`, onde um slice compraria
indireção e mais nada.

**A persistência fica ao lado do reducer, não dentro dele.** Favoritos e buscas recentes sobrevivem a
um reload via `localStorage`: a hidratação passa pelo `preloadedState` e as escritas por um listener
middleware. Os reducers seguem puros e o acesso ao storage fica fora do caminho de render. Leituras e
escritas são embrulhadas em `try/catch`, então navegação privada ou cota cheia degrada para uma lista
que dura só a sessão, em vez de quebrar a listagem.

**Seções complementares se escondem sozinhas.** "Últimos artigos" não tem endpoint próprio, então
reaproveita `/posts`, remove o post que está sendo lido e pega os três mais recentes; uma listagem
que falha ou vem vazia esconde a seção inteira, em vez de empilhar um erro sobre um artigo que
carregou bem. Os chips de categoria do painel de busca se comportam do mesmo jeito.

**A listagem de posts é buscada uma vez por sessão.** Três consumidores precisam da lista inteira —
a página de posts, a busca do header e "Latest articles" — então `getPosts` memoiza sua promise na
camada de API em vez de cada chamador buscar a própria cópia. A promise compartilhada é criada sem
abort signal de propósito: um consumidor desmontando não pode cancelar a requisição que os outros
estão esperando, e cada chamador já descarta o próprio resultado quando o seu signal aborta. Uma
rejeição limpa o cache, para que o retry do estado de erro ainda alcance a rede. Uma biblioteca de
data fetching faria isso e mais, mas para três endpoints a dependência não se paga.

**`ui/` e `features/` se dividem por posse, não por acoplamento.** Um componente fica em
`features/` quando pertence a exatamente uma feature, e em `ui/` quando mais de uma recorre a ele.
`PostCard` fica em `ui/` porque tanto a listagem quanto "Latest articles" o renderizam; `FilterBar`
e `PostScopeTabs` não recebem nada além de primitivos e ainda assim ficam em `features/`, porque só
existem para a página de posts. Dividir por acesso à store espalharia UI de uso único dentro de
`ui/` e arrastaria um único botão para o meio de features inteiras.

## Limitações conhecidas

- **A ordenação não tem efeito visível contra a API real.** Todos os posts voltam com o mesmo
  `createdAt`, então "mais recentes" e "mais antigos" produzem a mesma ordem. O controle foi
  implementado porque é um requisito, sem inventar um critério secundário de desempate.
  `sortPosts` é testado com datas sintéticas.
