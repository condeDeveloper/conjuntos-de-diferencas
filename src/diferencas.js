// Conjuntos de diferencas planares.
//
// Tome os inteiros modulo v = q^2 + q + 1 e escolha k = q + 1 deles. Olhe todas
// as k(k-1) diferencas entre pares ordenados. Se cada um dos v - 1 restos nao
// nulos aparecer EXATAMENTE UMA VEZ, o conjunto escolhido e um conjunto de
// diferencas planar de ordem q.
//
// A conta fecha na unha: k(k-1) = (q+1)q = q^2 + q = v - 1. Nao sobra folga
// nenhuma, e e por isso que esses conjuntos sao raros.
//
// Eles valem muito mais do que parecem: um conjunto de diferencas planar de
// ordem q E um plano projetivo de ordem q, com as retas sendo os deslocamentos
// do conjunto. Singer mostrou em 1938 que existe um sempre que q e potencia de
// primo. Fora disso, ninguem sabe construir nenhum — e em 1949 Bruck, Ryser e
// Chowla mostraram que para alguns q nao pode existir.
//
// A ordem 6 e o primeiro desses q proibidos, e e pequena o bastante para a
// varredura fechar o caso na mao.

/** v = q^2 + q + 1, o tamanho do grupo. */
export function tamanhoDoGrupo(q) {
  return q * q + q + 1;
}

/** k = q + 1, o tamanho do conjunto. */
export function tamanhoDoConjunto(q) {
  return q + 1;
}

/**
 * A conferencia ingenua: monta as k(k-1) diferencas e exige que cada resto nao
 * nulo apareca exatamente uma vez.
 *
 * E o criterio, escrito do jeito mais direto possivel. A busca de `varrer` usa
 * outro caminho, incremental, e os dois tem de concordar.
 */
export function ehConjuntoDeDiferencas(conjunto, v) {
  const k = conjunto.length;
  if (k * (k - 1) !== v - 1) return false;
  const conta = new Int32Array(v);
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      if (i === j) continue;
      const d = ((conjunto[i] - conjunto[j]) % v + v) % v;
      if (d === 0) return false;
      conta[d]++;
    }
  }
  for (let d = 1; d < v; d++) if (conta[d] !== 1) return false;
  return true;
}

/** Todas as diferencas de pares ordenados, na ordem em que o criterio as monta. */
export function diferencas(conjunto, v) {
  const lista = [];
  for (let i = 0; i < conjunto.length; i++) {
    for (let j = 0; j < conjunto.length; j++) {
      if (i !== j) lista.push(((conjunto[i] - conjunto[j]) % v + v) % v);
    }
  }
  return lista;
}

/**
 * A varredura: todos os conjuntos de diferencas planares de ordem q que contem
 * o zero.
 *
 * Todo conjunto de diferencas pode ser deslocado ate conter o zero, sem deixar
 * de ser um, entao exigir o zero nao perde nenhum — so deixa de contar v vezes
 * a mesma coisa.
 *
 * A poda e a definicao aplicada cedo: ao acrescentar um elemento novo, confere
 * se alguma das diferencas que ele cria com os anteriores JA apareceu. Se
 * apareceu, o ramo morre ali.
 *
 * `visita(conjunto)` recebe o vetor de trabalho, reusado. Para guardar, copie.
 *
 * Devolve { total, nos }: `nos` e quantos elementos foram experimentados, e e a
 * medida de quanto a poda economiza contra escolher os k-1 restantes as cegas.
 */
export function varrer(q, visita) {
  const v = tamanhoDoGrupo(q);
  const k = tamanhoDoConjunto(q);
  const conjunto = new Int32Array(k);
  const usada = new Uint8Array(v);
  let total = 0;
  let nos = 0;

  conjunto[0] = 0;

  function poe(indice, desde) {
    if (indice === k) {
      total++;
      if (visita) visita(conjunto);
      return;
    }
    // ainda faltam (k - indice) elementos; o maior possivel e v - 1
    const teto = v - (k - indice);
    for (let x = desde; x <= teto; x++) {
      nos++;
      let ok = true;
      let feitas = 0;
      for (let i = 0; i < indice; i++) {
        const a = (x - conjunto[i] + v) % v;
        const b = v - a;
        if (usada[a] || usada[b] || a === b) {
          ok = false;
          break;
        }
        usada[a] = 1;
        usada[b] = 1;
        feitas++;
      }
      if (ok) {
        conjunto[indice] = x;
        poe(indice + 1, x + 1);
      }
      for (let i = 0; i < feitas; i++) {
        const a = (x - conjunto[i] + v) % v;
        usada[a] = 0;
        usada[v - a] = 0;
      }
    }
  }

  poe(1, 1);
  return { q, v, k, total, nos };
}

/** Todos os conjuntos de diferencas de ordem q que contem o zero, como copias. */
export function todos(q) {
  const lista = [];
  varrer(q, (c) => lista.push(Array.from(c)));
  return lista;
}

/** Quantos conjuntos de diferencas com zero existem na ordem q. */
export function quantos(q) {
  return varrer(q).total;
}

/** C(n, j) exato, em BigInt. */
export function binomial(n, j) {
  if (j < 0 || j > n) return 0n;
  let r = 1n;
  for (let i = 0; i < j; i++) r = (r * BigInt(n - i)) / BigInt(i + 1);
  return r;
}

/** C(v - 1, k - 1): quantos conjuntos com zero existem para escolher. */
export function subconjuntos(q) {
  return binomial(tamanhoDoGrupo(q) - 1, tamanhoDoConjunto(q) - 1);
}

/**
 * Quantos nos uma busca SEM PODA abriria: todas as escolhas crescentes
 * parciais, de tamanho 1 ate k-1.
 *
 * E o denominador honesto. Comparar `nos` com C(v-1, k-1) compara no com folha
 * e da razao menor que 1 nas ordens pequenas — foi o que a primeira versao
 * desta tabela fez.
 */
export function nosSemPoda(q) {
  const v = tamanhoDoGrupo(q);
  const k = tamanhoDoConjunto(q);
  let soma = 0n;
  for (let j = 1; j <= k - 1; j++) soma += binomial(v - 1, j);
  return soma;
}

// --- equivalencia -----------------------------------------------------------
//
// Dois conjuntos sao o mesmo plano projetivo quando um vira o outro por
// deslocar (x -> x + t) e por multiplicar por um numero invertivel (x -> m x).

/** O conjunto normalizado: deslocado para conter o zero e ordenado. */
export function normalizar(conjunto, v) {
  const t = conjunto[0];
  return conjunto.map((x) => ((x - t) % v + v) % v).sort((a, b) => a - b);
}

/** A menor forma do conjunto entre todos os deslocamentos. */
export function menorDeslocamento(conjunto, v) {
  let melhor = null;
  for (const base of conjunto) {
    const d = conjunto.map((x) => ((x - base) % v + v) % v).sort((a, b) => a - b);
    const chave = d.join(',');
    if (melhor === null || chave < melhor) melhor = chave;
  }
  return melhor;
}

/** Os multiplicadores possiveis: os restos invertiveis modulo v. */
export function invertiveis(v) {
  const mdc = (a, b) => (b === 0 ? a : mdc(b, a % b));
  const lista = [];
  for (let m = 1; m < v; m++) if (mdc(m, v) === 1) lista.push(m);
  return lista;
}

/**
 * As classes de equivalencia: conjuntos agrupados por deslocamento e
 * multiplicacao.
 *
 * Cada classe e um plano projetivo. Saber quantas classes existem e saber
 * quantos planos projetivos CICLICOS de ordem q existem.
 */
export function classes(q) {
  const v = tamanhoDoGrupo(q);
  const lista = todos(q);
  const chaveDe = (c) => menorDeslocamento(c, v);
  const vistos = new Set();
  const grupos = [];

  for (const c of lista) {
    const chave = chaveDe(c);
    if (vistos.has(chave)) continue;
    const grupo = [];
    for (const m of invertiveis(v)) {
      const imagem = c.map((x) => (x * m) % v);
      const k = chaveDe(imagem);
      if (!vistos.has(k)) {
        vistos.add(k);
        grupo.push(k);
      }
    }
    grupos.push(grupo);
  }
  return grupos;
}
