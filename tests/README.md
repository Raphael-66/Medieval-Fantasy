# Testes

```bash
MODE=smart RUNS=30 node tests/harness.js tests/sim.js    # jogador cuidadoso: mortes e cartas por ato, finais
MODE=random RUNS=30 node tests/harness.js tests/sim.js   # jogador aleatório: mortes por medidor e por armadilha
node tests/morte_tela.js   # celular: a tela de morte não pode sair do enquadramento
```
Saída esperada no fim: `no page errors`. Referência (cuidadoso): cerca de 3 mortes no Ato I, 9 a 10 na história toda, todos os finais alcançáveis.
Os testes da versão clássica ficam em `classico/tests/`.
