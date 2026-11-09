// Os numeros do README, presos. Se o codigo mudar e um numero mudar, isto
// quebra antes de o README virar mentira.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  ordemDe,
  tabelaVarredura,
  tabelaClasses,
  tabelaBRC,
  tabelaSinger,
  tabelaMultiplicador,
  tabelaDiferencas,
} from '../src/medidas.js';

const MINUTO = 180_000;

test('as contagens por ordem: 6, 16, 10, 60, ZERO, 96 e 72', { timeout: MINUTO }, () => {
  const linhas = tabelaVarredura(8);
  assert.deepEqual(linhas.map((l) => l.conjuntos), [6, 16, 10, 60, 0, 96, 72]);
  assert.deepEqual(linhas.map((l) => l.v), [7, 13, 21, 31, 43, 57, 73]);
  assert.deepEqual(linhas.map((l) => l.k), [3, 4, 5, 6, 7, 8, 9]);
});

test('a ordem 6 e a unica zerada, e e a unica que nao e potencia de primo', { timeout: MINUTO }, () => {
  const linhas = tabelaVarredura(8);
  const zeradas = linhas.filter((l) => l.conjuntos === 0);
  assert.equal(zeradas.length, 1);
  assert.equal(zeradas[0].q, 6);
  assert.equal(zeradas[0].ehPotenciaDePrimo, false);
  for (const l of linhas) {
    assert.equal(l.conjuntos > 0, l.ehPotenciaDePrimo, 'q=' + l.q);
  }
});

test('provar que a ordem 6 nao tem conjunto custa 330.348 nos', { timeout: MINUTO }, () => {
  const seis = tabelaVarredura(8).find((l) => l.q === 6);
  assert.equal(seis.nos, 330_348);
  assert.equal(seis.semPoda, 6_220_767n);
  assert.equal(seis.subconjuntos, 5_245_786n);
  assert.equal(seis.razao.toFixed(1), '18.8');
});

test('a poda economiza 319,5 vezes na ordem 8', { timeout: MINUTO }, () => {
  const oito = tabelaVarredura(8).find((l) => l.q === 8);
  assert.equal(oito.nos, 42_612_864);
  assert.equal(oito.semPoda, 13_613_447_559n);
  assert.equal(oito.subconjuntos, 11_969_016_345n);
  assert.equal(oito.razao.toFixed(1), '319.5');
});

test('a razao da poda cresce de 1,1x para 319,5x', { timeout: MINUTO }, () => {
  const razoes = tabelaVarredura(8).map((l) => l.razao);
  for (let i = 1; i < razoes.length; i++) assert.ok(razoes[i] > razoes[i - 1]);
  assert.equal(razoes[0].toFixed(1), '1.1');
  assert.equal(razoes[razoes.length - 1].toFixed(1), '319.5');
});

test('toda ordem que tem conjunto tem UMA classe de equivalencia so', { timeout: MINUTO }, () => {
  for (const l of tabelaClasses(8)) {
    if (l.conjuntos === 0) {
      assert.equal(l.classes, 0, 'q=' + l.q);
      continue;
    }
    assert.equal(l.classes, 1, 'q=' + l.q);
    assert.equal(l.todasDoMesmoTamanho, true, 'q=' + l.q);
  }
});

test('tamanho da classe vezes ordem do multiplicador = invertiveis modulo v', { timeout: MINUTO }, () => {
  for (const l of tabelaClasses(8)) {
    if (l.conjuntos === 0) continue;
    assert.equal(l.bate, true, 'q=' + l.q);
    assert.equal(l.tamanho * l.ordemDoP, l.phi, 'q=' + l.q);
  }
  const oito = tabelaClasses(8).find((l) => l.q === 8);
  assert.equal(oito.tamanho, 8);
  assert.equal(oito.ordemDoP, 9);
  assert.equal(oito.phi, 72);
});

test('ordemDe acerta casos de mao', { timeout: MINUTO }, () => {
  assert.equal(ordemDe(2, 7), 3);
  assert.equal(ordemDe(3, 13), 3);
  assert.equal(ordemDe(2, 21), 6);
  assert.equal(ordemDe(1, 7), 1);
});

test('BRC proibe so a ordem 6 ate q=12, e nao proibe a 10', { timeout: MINUTO }, () => {
  const linhas = tabelaBRC(12, 8);
  const proibidas = linhas.filter((l) => l.brcProibe).map((l) => l.q);
  assert.deepEqual(proibidas, [6]);
  const dez = linhas.find((l) => l.q === 10);
  assert.equal(dez.brcProibe, false);
  assert.deepEqual(dez.somaDeDoisQuadrados, [1, 3]);
  assert.equal(dez.ehPotenciaDePrimo, false);
});

test('a ordem 12 nao e potencia de primo e BRC nao a proibe', { timeout: MINUTO }, () => {
  const doze = tabelaBRC(12, 8).find((l) => l.q === 12);
  assert.equal(doze.ehPotenciaDePrimo, false);
  assert.equal(doze.brcProibe, false);
  assert.equal(doze.somaDeDoisQuadrados, null);
  assert.equal(doze.restoPor4, 0); // o teorema nem se aplica
});

test('Singer entrega {0,1,3} na ordem 2 e doze numeros na ordem 11', { timeout: MINUTO }, () => {
  const linhas = tabelaSinger(11).filter((l) => l.conjunto !== null);
  assert.deepEqual(linhas.map((l) => l.q), [2, 3, 5, 7, 11]);
  for (const l of linhas) {
    assert.equal(l.valido, true, 'q=' + l.q);
    assert.equal(l.tamanho, l.esperado, 'q=' + l.q);
  }
  assert.deepEqual(linhas[0].conjunto, [0, 1, 3]);
  assert.deepEqual(linhas[1].conjunto, [0, 1, 3, 9]);
  assert.deepEqual(linhas[4].conjunto, [0, 1, 3, 15, 46, 71, 75, 84, 94, 101, 112, 128]);
});

test('a varredura acha todo conjunto que Singer constroi, ate a ordem 8', { timeout: MINUTO }, () => {
  for (const l of tabelaSinger(8)) {
    if (l.conjunto === null) continue;
    assert.equal(l.achado, true, 'q=' + l.q);
  }
});

test('o multiplicador nao falha em nenhum dos 260 conjuntos ate a ordem 8', { timeout: MINUTO }, () => {
  const linhas = tabelaMultiplicador(8);
  for (const l of linhas) assert.equal(l.falhas, 0, 'q=' + l.q);
  assert.equal(linhas.reduce((s, l) => s + l.conjuntos, 0), 260);
});

test('as diferencas cabem na unha em toda ordem, e todos os conjuntos passam', { timeout: MINUTO }, () => {
  for (const l of tabelaDiferencas(8)) {
    assert.equal(l.cabeNaUnha, true, 'q=' + l.q);
    assert.equal(l.diferencasPorConjunto, l.restosNaoNulos, 'q=' + l.q);
    assert.equal(l.todosValidos, true, 'q=' + l.q);
  }
  const oito = tabelaDiferencas(8).find((l) => l.q === 8);
  assert.equal(oito.v, 73);
  assert.equal(oito.diferencasPorConjunto, 72);
});
