# A Ampulheta de Cinzas — guia para o Claude

Jogo de decisões em cartas (estilo Reigns e Lapse), em **português do Brasil**, PWA de um arquivo só. Dono: Raphael-66. Publicado em https://raphael-66.github.io/Medieval-Fantasy/

Leia antes: `docs/HISTORIA.md` (regras, atos, reviravoltas e finais).

## Estrutura
- `index.html` é **gerado**: não edite direto. Edite `fonte/motor.html` (interface e regras) e `fonte/historia.js` (cartas, atos, mortes, memórias, finais) e rode `python3 fonte/montar.py`.
- `classico/` é a versão anterior (Modo Livre, batalhas, 10 arcos), congelada. Tem saves próprios (`amp_`), `sw.js`, testes e docs dela. Só mexa lá se o dono pedir.
- Saves do jogo novo: `amp2_save` (partida), `amp2_meta` (memórias, finais, pessoas vistas), `amp2_nome`. Cache do service worker: `amp2-`.

## Regras do projeto
- Texto em português do Brasil, frases curtas, tom dramático mas claro. História, nomes e lugares originais.
- O objetivo do ato tem de estar sempre claro na tela. Nada de mecânica escondida que confunda.
- Medidores morrem nas duas pontas. Efeitos das cartas comuns são multiplicados por `EMUL` (1,5) no motor. Cartas de equilíbrio (`B`) aparecem quando um medidor passa de 22 ou 78.
- Toda carta-armadilha (`die`) precisa de um caminho seguro e, depois da morte, de uma versão alternativa ou de um ⚠ (memória). Nunca crie um beco sem saída.
- Use `{N}` para o nome do herói nos textos.
- Romance e família, se aparecerem, sempre leves.

## Fluxo de atualização
1. Editar `fonte/`, rodar `python3 fonte/montar.py`, checar sintaxe (extrair o `<script>` e `node --check`).
2. Rodar `MODE=smart RUNS=30 node tests/harness.js tests/sim.js` e `MODE=random ...` (veja `tests/README.md`).
3. Trocar o hash em `sw.js` (`versão XXXX` e `amp2-XXXX`).
4. Atualizar `docs/HISTORICO.md`. Commit em português e push na `main`.
