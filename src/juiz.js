// O juiz. Tres coisas que nao compartilham codigo com a busca:
//
//   1. a CONSTRUCAO de Singer, que nao procura nada: monta o conjunto por
//      algebra, dentro do corpo de q^3 elementos, e a varredura tem de
//      encontrar o que ela constroi;
//   2. o TEOREMA DO MULTIPLICADOR, que diz que todo divisor primo de q leva o
//      conjunto nele mesmo, a menos de um deslocamento — uma propriedade que a
//      busca nao conhece e nunca usou para podar;
//   3. BRUCK-RYSER-CHOWLA, de 1949, que proibe certas ordens sem olhar um
//      conjunto sequer.
//
// A construcao de Singer esta implementada so para q PRIMO, porque so para ele
// o corpo de q^3 elementos sai de polinomios sobre os inteiros modulo q. As
// ordens 4, 8 e 9 sao potencias de primo e tem conjunto — a varredura acha —
// mas a construcao daqui nao chega nelas.

import { tamanhoDoGrupo, tamanhoDoConjunto } from './diferencas.js';

/** Os primos ate n, pela peneira. */
export function primos(ate) {
  const composto = new Uint8Array(ate + 1);
  const lista = [];
  for (let i = 2; i <= ate; i++) {
    if (composto[i]) continue;
    lista.push(i);
    for (let j = i * i; j <= ate; j += i) composto[j] = 1;
  }
  return lista;
}

/** q e potencia de primo? Devolve o primo, ou null. */
export function primoDaPotencia(q) {
  for (const p of primos(q)) {
    let x = q;
    while (x % p === 0) x /= p;
    if (x === 1) return p;
  }
  return null;
}

/** n e soma de dois quadrados? */
export function somaDeDoisQuadrados(n) {
  for (let a = 0; a * a <= n; a++) {
    const resto = n - a * a;
    const b = Math.round(Math.sqrt(resto));
    if (b * b === resto) return [a, b];
  }
  return null;
}

/**
 * Bruck-Ryser-Chowla para plano projetivo: se q deixa resto 1 ou 2 na divisao
 * por 4, entao q tem de ser soma de dois quadrados. Caso contrario nao existe
 * plano de ordem q — e portanto nao existe conjunto de diferencas planar.
 *
 * O teorema nao diz nada quando q deixa resto 0 ou 3: ai ele simplesmente nao
 * se aplica, e nao e permissao.
 */
export function brcProibe(q) {
  const resto = q % 4;
  if (resto !== 1 && resto !== 2) return false;
  return somaDeDoisQuadrados(q) === null;
}

// --- o corpo de q^3 elementos, para q primo ---------------------------------

/**
 * Um cubico monico irredutivel sobre os inteiros modulo p: x^3 + a x^2 + b x + c.
 *
 * Em grau 3 basta nao ter raiz — se fatorasse, teria um fator de grau 1.
 * Devolve [c, b, a], os coeficientes de x^0, x^1 e x^2 do polinomio x^3 menos
 * ele, na forma que a multiplicacao usa.
 */
export function cubicoIrredutivel(p) {
  for (let a = 0; a < p; a++) {
    for (let b = 0; b < p; b++) {
      for (let c = 0; c < p; c++) {
        let temRaiz = false;
        for (let x = 0; x < p; x++) {
          if ((((x * x % p) * x % p) + a * x * x + b * x + c) % p === 0) {
            temRaiz = true;
            break;
          }
        }
        if (!temRaiz) return { a, b, c };
      }
    }
  }
  return null;
}

/**
 * Multiplica dois elementos do corpo, cada um como [a0, a1, a2] querendo dizer
 * a0 + a1 x + a2 x^2, reduzindo por x^3 = -(a x^2 + b x + c).
 */
export function multiplicar(u, w, p, poli) {
  const r = [0, 0, 0, 0, 0];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) r[i + j] = (r[i + j] + u[i] * w[j]) % p;
  }
  // reduzir x^4 e depois x^3
  for (let grau = 4; grau >= 3; grau--) {
    const coef = r[grau];
    if (!coef) continue;
    r[grau] = 0;
    // x^grau = x^(grau-3) * x^3 = x^(grau-3) * (-(a x^2 + b x + c))
    r[grau - 1] = (r[grau - 1] - coef * poli.a % p + p * p) % p;
    r[grau - 2] = (r[grau - 2] - coef * poli.b % p + p * p) % p;
    r[grau - 3] = (r[grau - 3] - coef * poli.c % p + p * p) % p;
  }
  return [r[0], r[1], r[2]];
}

/**
 * A construcao de Singer, de 1938, para q primo.
 *
 * Os pontos do plano projetivo de ordem q sao as direcoes do corpo de q^3
 * elementos vistas sobre o corpo de q. Um gerador g do corpo percorre todas
 * elas; o conjunto D sao os expoentes i em que g^i cai no plano "sem termo em
 * x^2", que e uma reta.
 *
 * Nao confere nada: entrega o conjunto. Quem confere e `ehConjuntoDeDiferencas`.
 */
export function singer(q) {
  const p = q;
  if (!primos(q).includes(q)) return null;
  const poli = cubicoIrredutivel(p);
  if (!poli) return null;

  const v = tamanhoDoGrupo(q);
  const ordem = q * q * q - 1;
  const iguais = (u, w) => u[0] === w[0] && u[1] === w[1] && u[2] === w[2];

  for (let c2 = 0; c2 < p; c2++) {
    for (let c1 = 0; c1 < p; c1++) {
      for (let c0 = 0; c0 < p; c0++) {
        const g = [c0, c1, c2];
        if (iguais(g, [0, 0, 0])) continue;
        // g e gerador? a ordem dele tem de ser q^3 - 1
        let x = [1, 0, 0];
        let ordemDeG = 0;
        for (let i = 1; i <= ordem; i++) {
          x = multiplicar(x, g, p, poli);
          if (iguais(x, [1, 0, 0])) {
            ordemDeG = i;
            break;
          }
        }
        if (ordemDeG !== ordem) continue;

        const conjunto = [];
        let y = [1, 0, 0];
        for (let i = 0; i < v; i++) {
          if (y[2] === 0) conjunto.push(i);
          y = multiplicar(y, g, p, poli);
        }
        if (conjunto.length === tamanhoDoConjunto(q)) return conjunto;
      }
    }
  }
  return null;
}

/**
 * O teorema do multiplicador: se p divide q, entao multiplicar o conjunto por p
 * devolve o proprio conjunto deslocado.
 *
 * Devolve o deslocamento, ou null se a propriedade falhar. A busca nunca usou
 * isso — ela nem sabe que existe —, entao e uma conferencia de verdade.
 */
export function multiplicadorDe(conjunto, v, m) {
  const original = new Set(conjunto);
  const imagem = conjunto.map((x) => (x * m) % v);
  for (let t = 0; t < v; t++) {
    let bate = true;
    for (const x of imagem) {
      if (!original.has(((x - t) % v + v) % v)) {
        bate = false;
        break;
      }
    }
    if (bate) return t;
  }
  return null;
}
