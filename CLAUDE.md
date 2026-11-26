# A Ampulheta de Cinzas — guia para o Claude

Fantasia medieval original em **português do Brasil**, feita como PWA de um arquivo só. Dono: Raphael-66. Nasceu como cópia do motor do jogo `return-from-death-zero-` (que continua no repositório dele, sem mudanças): todos os nomes, lugares e a história foram trocados por criações próprias, e o Modo Retornos ganhou uma campanha nova de 10 arcos no Reino de Lusávia, no ano da Peste de 1348.

Leia também: `docs/HISTORIA.md` (bíblia da história), `docs/ARQUITETURA.md`, `docs/SISTEMAS.md`, `docs/BALANCEAMENTO.md`, `docs/HISTORICO.md`, `docs/ROADMAP.md`.

## Regras do projeto
- Todo texto do jogo e das conversas com o dono é em **português do Brasil**, tom leve e caloroso, frases curtas.
- Personagens, lugares e história são **originais** (veja `docs/HISTORIA.md`). Não traga nomes, falas ou termos de outras obras. Ícones e ilustrações são originais (SVG/Unicode).
- Os ids internos antigos (`emilia`, `rem`, `subaru`, `BAT.elsa`...) foram mantidos no código para não quebrar nada; o jogador só vê os nomes novos (`IDN`, `cap()`, `NAMES`, `CHAR`). Em texto novo, use sempre os nomes de exibição.
- **Nome do herói:** o jogador escolhe (`heroName()`, chave `amp_nome`). Em texto novo, escreva "Tomás" normalmente: a camada "NOME DO PROTAGONISTA" troca na tela. Não monte frases que dependam do nome ter gênero ou tamanho específico.
- Conteúdo de família e romance é sempre **leve e adequado** (sem nada sexual).
- O jogo precisa funcionar **offline** e no **celular** (tela de 390 px é a referência).
- Os saves ficam no `localStorage` do aparelho. **Nunca quebre saves antigos**: toda estrutura nova precisa de valor padrão e migração (veja `normalize`, `L()`, `RS()`, `clockify`).

## Como o código está organizado (resumo)
- `index.html` (~7.300 linhas): CSS no `<style>`, HTML mínimo das telas e **um único `<script>`** dentro de uma IIFE com `"use strict"`.
- O código cresce em **camadas de atualização**: cada pacote novo vai no fim do script, logo **antes do bloco `/* tela inicial: Modo Retornos (principal)` e do `toTitle();`**, e estende funções antigas com o padrão:
  ```js
  var _velha=nomeDaFuncao;
  nomeDaFuncao=function(...){ /* antes */ _velha(...); /* depois */ };
  ```
  A ordem importa: a última camada envolve todas as anteriores. Funções muito usadas nesse padrão: `startBattle`, `endBattle`, `playCard`, `endTurn`, `renderBattle`, `renderHub`, `sleepDay`, `goPlace`, `levelize`, `eq`, `placeOf`, `sleepPlace`, `personMenu`, `paneStore`, `openMenu` (esta foi editada no lugar).
- Ganchos de extensão prontos: `PAX` (botões de ação no lugar do mapa), `PAH` (tratadores dessas ações), `WSEC` (seções da aba Mundo), `MAPTOP`, `ACH` (conquistas), `CARDS`/`addC` (cartas), `GD`/`tierSet` (itens/espólios).

## Fluxo de trabalho de uma atualização
1. `git pull`, ler a parte relevante do `index.html` (grep pelo nome da função).
2. Escrever o pacote novo numa camada no fim do script (ou editar no lugar, se for correção pontual).
3. Checar sintaxe: extrair o `<script>` e rodar `node --check`.
4. Rodar os testes em `tests/` (veja `tests/README.md`): pelo menos `flow.js`, `rg.js` e o `monkey.js` nos dois modos.
5. **Atualizar a versão do service worker** em `sw.js` (as strings `versão XXXX` e `amp-XXXX` com um hash novo); sem isso o celular continua com a versão antiga.
6. Atualizar `docs/HISTORICO.md` (e os outros docs se mudar algo estrutural).
7. Commit em português, push na `main`. O GitHub Pages publica sozinho em ~1 minuto.

## Armadilhas conhecidas
- **Coerência com a história:** nenhum personagem ou lugar pode aparecer antes do arco em que entra na história. Ao criar conteúdo novo com personagens, confira `CHAR_ARC`/`CHAR_RE` (redefinidos na camada da história); textos que citam nomes são filtrados por `textArc`.
- **10 arcos:** use `NARC` em vez de números fixos. A campanha fica na camada "A Ampulheta de Cinzas" (perto do fim do script): `ARCS`, cartas `h1_...h10_`, `AGOAL`, `MD`, `ARCALLY`, `STORYBAT`, `CREQ`. Leonor dorme do fim do Arco 4 até o Arco 8.
- **Interface do hub:** `hubDrawers` reorganiza o DOM depois do `renderHub` (Atualização 18). Cartões novos com `.sec`/título caem em "Mais" se não forem classificados; ações novas do mapa precisam de uma categoria em `ACAT` (pelo `data-ac`). Abas novas do menu precisam entrar em `MGROUP`.
- `S.t` no Modo Livre é um **getter** calculado de `S.h` (horas). Nunca retorna 3; use `S.h` para horário. `advanceTime(h)` aceita horas (padrão 2h).
- Overlays (`#overlay`) são reaproveitados: sempre conferir `$("#overlay").hidden` antes de abrir outro automaticamente.
- `renderBattle` recria o DOM da batalha: animações flutuantes vão para a camada fixa `#fxl`.
- Perfil compartilhado entre modos: `PF` (`amp_pf`). Todas as chaves de save usam o prefixo `amp_` (e o cache `amp-`) para não colidir com o jogo original no mesmo site. Cartas extras, moedas, fragmentos etc. sincronizam via `pfPull`/`pfPush` (`PF.sh`).
- A classe CSS `.me` era usada no painel e na barra de vida: a barra do jogador agora é `.bar.hpme`.

## Ferramentas externas
- **Conector Unity (`Raphael-66/engine`)**: servidor MCP + pacote do Editor para o Claude controlar o Unity (versão de referência: Unity 6 / 6000.0 LTS). Fica **só** naquele repositório: não copie o código para cá. Este jogo é HTML/JS e não usa o conector; mudanças no conector vão em commits no `engine`.
