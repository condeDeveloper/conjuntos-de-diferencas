// As tabelas do README. Todo numero daqui sai de um metodo; nenhum e digitado.

import {
  tamanhoDoGrupo,
  tamanhoDoConjunto,
  varrer,
  todos,
  quantos,
  nosSemPoda,
  subconjuntos,
  classes,
  invertiveis,
  menorDeslocamento,
  ehConjuntoDeDiferencas,
  diferencas,
} from './diferencas.js';
import { singer, multiplicadorDe, primoDaPotencia, brcProibe, somaDeDoisQuadrados } from './juiz.js';

/** A ordem de m no grupo dos invertiveis modulo v. */
export function ordemDe(m, v) {
  let x = m % v;
  let n = 1;
  while (x !== 1) {
    x = (x * m) % v;
    n++;
    if (n > v) return null;
  }
  return n;
}

/** Tabela 1 — a varredura por ordem, e o que a poda economiza. */
export function tabelaVarredura(ate = 8) {
  const linhas = [];
  for (let q = 2; q <= ate; q++) {
    const r = varrer(q);
    const sem = nosSemPoda(q);
    linhas.push({
      q,
      v: r.v,
      k: r.k,
      conjuntos: r.total,
      nos: r.nos,
      semPoda: sem,
      subconjuntos: subconjuntos(q),
      razao: Number(sem) / r.nos,
      ehPotenciaDePrimo: primoDaPotencia(q) !== null,
    });
  }
  return linhas;
}

/**
 * Tabela 2 — as classes de equivalencia.
 *
 * Cada classe e um plano projetivo ciclico. O tamanho de uma classe e o numero
 * de multiplicadores possiveis dividido pela ordem do multiplicador p — e isso
 * sai da propria tabela, sem ninguem ter contado a mao.
 */
export function tabelaClasses(ate = 8) {
  const linhas = [];
  for (let q = 2; q <= ate; q++) {
    const v = tamanhoDoGrupo(q);
    const grupos = classes(q);
    if (grupos.length === 0) {
      linhas.push({ q, v, conjuntos: 0, classes: 0, tamanho: null, phi: invertiveis(v).length, ordemDoP: null, bate: null });
      continue;
    }
    const p = primoDaPotencia(q);
    const phi = invertiveis(v).length;
    const ordemDoP = p === null ? null : ordemDe(p, v);
    const tamanho = grupos[0].length;
    linhas.push({
      q,
      v,
      conjuntos: quantos(q),
      classes: grupos.length,
      tamanho,
      todasDoMesmoTamanho: grupos.every((g) => g.length === tamanho),
      phi,
      ordemDoP,
      bate: ordemDoP !== null && tamanho * ordemDoP === phi,
    });
  }
  return linhas;
}

/**
 * Tabela 3 — Bruck-Ryser-Chowla contra a varredura.
 *
 * O teorema e de 1949 e nao olha um conjunto sequer: so a aritmetica de q. A
 * coluna da varredura e a conferencia dele, caso a caso, ate onde a busca
 * alcanca.
 */
export function tabelaBRC(ate = 12, varrerAte = 9) {
  const linhas = [];
  for (let q = 2; q <= ate; q++) {
    const soma = somaDeDoisQuadrados(q);
    const p = primoDaPotencia(q);
    const varrido = q <= varrerAte;
    linhas.push({
      q,
      restoPor4: q % 4,
      somaDeDoisQuadrados: soma,
      brcProibe: brcProibe(q),
      ehPotenciaDePrimo: p !== null,
      varrido,
      encontrados: varrido ? quantos(q) : null,
    });
  }
  return linhas;
}

/** Tabela 4 — a construcao de Singer, e se a varredura a encontra. */
export function tabelaSinger(ate = 11) {
  const linhas = [];
  for (let q = 2; q <= ate; q++) {
    const conjunto = singer(q);
    if (conjunto === null) {
      linhas.push({ q, conjunto: null, valido: null, achado: null });
      continue;
    }
    const v = tamanhoDoGrupo(q);
    const valido = ehConjuntoDeDiferencas(conjunto, v);
    let achado = null;
    if (q <= 8) {
      const chave = menorDeslocamento(conjunto, v);
      achado = todos(q).some((c) => menorDeslocamento(c, v) === chave);
    }
    linhas.push({ q, v, conjunto, valido, achado, tamanho: conjunto.length, esperado: tamanhoDoConjunto(q) });
  }
  return linhas;
}

/**
 * Tabela 5 — o teorema do multiplicador conferido em todo conjunto.
 *
 * A busca nao conhece esse teorema e nunca o usou para podar. Se ele falhasse
 * num conjunto so, ou a busca achou lixo ou o teorema nao e o que eu li.
 */
export function tabelaMultiplicador(ate = 8) {
  const linhas = [];
  for (let q = 2; q <= ate; q++) {
    const p = primoDaPotencia(q);
    const v = tamanhoDoGrupo(q);
    const lista = todos(q);
    let falhas = 0;
    const deslocamentos = new Set();
    for (const c of lista) {
      const t = p === null ? null : multiplicadorDe(c, v, p);
      if (t === null) falhas++;
      else deslocamentos.add(t);
    }
    linhas.push({ q, p, conjuntos: lista.length, falhas, deslocamentosDistintos: deslocamentos.size });
  }
  return linhas;
}

/**
 * Tabela 6 — as diferencas conferidas pelo criterio ingenuo, conjunto a
 * conjunto: cada resto nao nulo aparece exatamente uma vez.
 */
export function tabelaDiferencas(ate = 8) {
  const linhas = [];
  for (let q = 2; q <= ate; q++) {
    const v = tamanhoDoGrupo(q);
    const k = tamanhoDoConjunto(q);
    const lista = todos(q);
    let todosValidos = true;
    for (const c of lista) {
      if (!ehConjuntoDeDiferencas(c, v)) todosValidos = false;
      if (diferencas(c, v).length !== k * (k - 1)) todosValidos = false;
    }
    linhas.push({
      q,
      v,
      k,
      conjuntos: lista.length,
      diferencasPorConjunto: k * (k - 1),
      restosNaoNulos: v - 1,
      cabeNaUnha: k * (k - 1) === v - 1,
      todosValidos,
    });
  }
  return linhas;
}
