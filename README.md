# Conjuntos de diferenças planares

Todas as ordens de 2 a **9** varridas por retrocesso — 486.530.121 nós só na
última — com a construção de Singer, o teorema do multiplicador e
Bruck-Ryser-Chowla como juízes. Node puro, sem dependência nenhuma.

Tome os inteiros módulo `v = q² + q + 1` e escolha `k = q + 1` deles. Olhe todas
as diferenças entre pares. Se cada um dos `v − 1` restos não nulos aparecer
**exatamente uma vez**, o conjunto é um conjunto de diferenças planar de ordem
`q`.

A conta fecha na unha: `k(k−1) = (q+1)q = q² + q = v − 1`. Não sobra folga
nenhuma, e é por isso que esses conjuntos são raros.

Eles valem muito mais do que parecem: **um conjunto de diferenças planar de
ordem `q` é um plano projetivo de ordem `q`**, com as retas sendo os
deslocamentos do conjunto. Singer mostrou em 1938 que existe um sempre que `q` é
potência de primo. Fora disso ninguém sabe construir nenhum — e em 1949 Bruck,
Ryser e Chowla mostraram que para certas ordens não pode existir.

A ordem 6 é a primeira dessas ordens proibidas, e é pequena o bastante para a
varredura fechar o caso na mão.

## Os quatro achados

1. **A ordem 6 fechada na unha: 330.348 nós, zero conjuntos.** Bruck, Ryser e
   Chowla proibiram essa ordem em 1949 sem olhar um conjunto sequer — só pela
   aritmética de 6. A varredura confere caso a caso e chega no mesmo lugar, e é
   a única ordem zerada até a 9.
2. **Toda ordem que tem conjunto tem UMA classe de equivalência só.** De 2 a 9,
   todos os conjuntos de cada ordem são o **mesmo** plano projetivo visto de
   ângulos diferentes. E o tamanho da classe vezes a ordem do multiplicador dá
   exatamente o número de invertíveis módulo `v` — três contas que não se falam,
   e que fecham em todas as sete ordens.
3. **Bruck-Ryser-Chowla não proíbe a ordem 10.** Dez é `1² + 3²`, e o teorema
   deixa passar. Ela mesmo assim não existe: foi preciso uma prova por
   computador, em 1989, com milhares de horas de processamento. E a **ordem 12**
   não é potência de primo, não é proibida, e continua em aberto até hoje.
4. **A poda cresce de 1,1x para 1.627,7x.** Conferir as diferenças na hora de
   acrescentar cada elemento — em vez de montar o conjunto e olhar depois — é a
   única razão de a varredura alcançar a ordem 9. Sem ela seriam 791.908.666.288
   nós em vez de 486.530.121.

## Três juízes

- **A construção de Singer**, de 1938. Não procura nada: monta o conjunto por
  álgebra, dentro do corpo de `q³` elementos, e a varredura tem de encontrar o
  que ela constrói. Está implementada só para `q` **primo**, porque só aí o
  corpo de `q³` elementos sai de polinômios sobre os inteiros módulo `q`.
- **O teorema do multiplicador**: todo divisor primo de `q` leva o conjunto nele
  mesmo, a menos de um deslocamento. A busca não conhece esse teorema e nunca o
  usou para podar — se ele falhasse num conjunto só, ou a busca achou lixo ou eu
  li o teorema errado.
- **Bruck-Ryser-Chowla**: se `q` deixa resto 1 ou 2 na divisão por 4, então `q`
  tem de ser soma de dois quadrados. Quando o resto é 0 ou 3 o teorema
  simplesmente **não se aplica** — e isso não é permissão.

## As medidas

Tudo abaixo sai de `node ferramentas/medidor.js`. Nenhum número foi digitado à
mão.

### A varredura por ordem, e o que a poda economiza

| q | v = q²+q+1 | k = q+1 | conjuntos | nós abertos | nós sem poda | razão | subconjuntos | q é potência de primo |
|---|---|---|---|---|---|---|---|---|
| 2 | 7 | 3 | 6 | 20 | 21 | 1,1x | 15 | sim |
| 3 | 13 | 4 | 16 | 225 | 298 | 1,3x | 220 | sim |
| 4 | 21 | 5 | 10 | 2.798 | 6.195 | 2,2x | 4.845 | sim |
| 5 | 31 | 6 | 60 | 30.381 | 174.436 | 5,7x | 142.506 | sim |
| **6** | **43** | **7** | **0** | **330.348** | 6.220.767 | 18,8x | 5.245.786 | **NÃO** |
| 7 | 57 | 8 | 96 | 3.786.355 | 268.602.258 | 70,9x | 231.917.400 | sim |
| 8 | 73 | 9 | 72 | 42.612.864 | 13.613.447.559 | 319,5x | 11.969.016.345 | sim |
| 9 | 91 | 10 | 120 | 486.530.121 | 791.908.666.288 | 1.627,7x | 706.252.528.630 | sim |

**Nós sem poda** não é o número de subconjuntos: é a soma das escolhas
crescentes parciais, de tamanho 1 até `k−1`. Comparar nó com subconjunto compara
nó com folha, e dá razão **menor que 1** nas ordens pequenas — foi o que a
primeira versão desta tabela fez.

A ordem 9 está num teste pesado e leva dez segundos. A ordem 10 é o próximo caso
proibido conhecido, e não está aqui: a prova de que ela não existe é de 1989, de
Lam, Thiel e Swiercz, e levou milhares de horas num supercomputador. Este
retrocesso não termina.

### As classes de equivalência: quantos planos projetivos cíclicos

| q | conjuntos | classes | tamanho da classe | invertíveis mod v | ordem de p | tamanho × ordem = invertíveis |
|---|---|---|---|---|---|---|
| 2 | 6 | 1 | 2 | 6 | 3 | sim |
| 3 | 16 | 1 | 4 | 12 | 3 | sim |
| 4 | 10 | 1 | 2 | 12 | 6 | sim |
| 5 | 60 | 1 | 10 | 30 | 3 | sim |
| 6 | 0 | 0 | — | 42 | — | — |
| 7 | 96 | 1 | 12 | 36 | 3 | sim |
| 8 | 72 | 1 | 8 | 72 | 9 | sim |
| 9 | 120 | 1 | 12 | 72 | 6 | sim |

Dois conjuntos são o mesmo plano quando um vira o outro por deslocar e por
multiplicar. **Uma classe só**, em todas as sete ordens que têm conjunto.

### Bruck-Ryser-Chowla contra a varredura

| q | q mod 4 | soma de dois quadrados | BRC proíbe | potência de primo | varrido | encontrados |
|---|---|---|---|---|---|---|
| 2 | 2 | 1² + 1² | não | sim | sim | 6 |
| 3 | 3 | não é | não | sim | sim | 16 |
| 4 | 0 | 0² + 2² | não | sim | sim | 10 |
| 5 | 1 | 1² + 2² | não | sim | sim | 60 |
| **6** | 2 | **não é** | **SIM** | não | sim | **0** |
| 7 | 3 | não é | não | sim | sim | 96 |
| 8 | 0 | 2² + 2² | não | sim | sim | 72 |
| 9 | 1 | 0² + 3² | não | sim | sim | 120 |
| **10** | 2 | **1² + 3²** | **não** | **não** | não | — |
| 11 | 3 | não é | não | sim | não | — |
| **12** | 0 | não é | **não** | **não** | não | — |

As linhas 10 e 12 são as interessantes. BRC deixa as duas passarem; a 10 não
existe mesmo assim, e a 12 ninguém sabe.

### A construção de Singer, de 1938 (só para q primo)

| q | conjunto | tamanho | é q+1 | passa no critério | a varredura acha |
|---|---|---|---|---|---|
| 2 | {0, 1, 3} | 3 | sim | sim | sim |
| 3 | {0, 1, 3, 9} | 4 | sim | sim | sim |
| 5 | {0, 1, 4, 10, 12, 17} | 6 | sim | sim | sim |
| 7 | {0, 1, 7, 24, 36, 38, 49, 54} | 8 | sim | sim | sim |
| 11 | {0, 1, 3, 15, 46, 71, 75, 84, 94, 101, 112, 128} | 12 | sim | sim | — |

### O teorema do multiplicador, conferido em todo conjunto

| q | p | conjuntos | falhas | deslocamentos distintos |
|---|---|---|---|---|
| 2 | 2 | 6 | 0 | 6 |
| 3 | 3 | 16 | 0 | 13 |
| 4 | 2 | 10 | 0 | 8 |
| 5 | 5 | 60 | 0 | 30 |
| 6 | — | 0 | 0 | 0 |
| 7 | 7 | 96 | 0 | 19 |
| 8 | 2 | 72 | 0 | 72 |

Duzentos e sessenta conjuntos, nenhuma falha.

### As diferenças conferidas pelo critério ingênuo

| q | v | k | conjuntos | diferenças por conjunto | restos não nulos | cabe na unha |
|---|---|---|---|---|---|---|
| 2 | 7 | 3 | 6 | 6 | 6 | sim |
| 3 | 13 | 4 | 16 | 12 | 12 | sim |
| 4 | 21 | 5 | 10 | 20 | 20 | sim |
| 5 | 31 | 6 | 60 | 30 | 30 | sim |
| 6 | 43 | 7 | 0 | 42 | 42 | sim |
| 7 | 57 | 8 | 96 | 56 | 56 | sim |
| 8 | 73 | 9 | 72 | 72 | 72 | sim |

## O que as medidas me corrigiram

- **Comparei nós com subconjuntos**, e a razão da poda deu **0,8x** na ordem 2 —
  a poda aparentemente piorando a busca. Nó não é folha. O denominador honesto é
  a soma das escolhas parciais, e com ele a razão vira 1,1x e cresce daí.
- **Escrevi 826.070.506.567 de cabeça** para os nós sem poda da ordem 9,
  estendendo a curva da ordem 8 no olho. O certo é **791.908.666.288**.
- **Esperava que a construção de Singer alcançasse a ordem 9**, já que 9 é
  potência de primo e o teorema vale para potência de primo. Não alcança: o
  corpo de 9³ elementos não sai de polinômios sobre os inteiros módulo 9, porque
  os inteiros módulo 9 **não são um corpo**. A varredura chega lá e a construção
  daqui não.
- **Li "BRC proíbe" como "BRC decide".** Ele não decide: quando `q` deixa resto
  0 ou 3 na divisão por 4, o teorema não se aplica, e isso não é permissão. A
  ordem 10 passa por ele e não existe; a 12 passa por ele e ninguém sabe.

## Rodar

```bash
node --test testes/*.test.js          # os 39 testes (o pesado leva ~1 min)
node ferramentas/medidor.js           # todas as tabelas
node ferramentas/medidor.js brc       # uma tabela só
```

São **39 testes**: 21 de comportamento, 14 prendendo os números das tabelas e 4
na varredura da ordem 9. Sem `npm install`: não há dependência nenhuma. Node 20
ou mais novo.

## Licença

MIT.
