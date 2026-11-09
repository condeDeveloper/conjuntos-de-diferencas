// O comportamento. Nada de tabela aqui: isto e o que um conjunto de diferencas
// e, e o que os tres juizes dizem sobre ele.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  tamanhoDoGrupo,
  tamanhoDoConjunto,
  ehConjuntoDeDiferencas,
  diferencas,
  varrer,
  todos,
  quantos,
  binomial,
  subconjuntos,
  nosSemPoda,
  normalizar,
  menorDeslocamento,
  invertiveis,
  classes,
} from '../src/diferencas.js';
import {
  primos,
  primoDaPotencia,
  somaDeDoisQuadrados,
  brcProibe,
  cubicoIrredutivel,
  multiplicar,
  singer,
  multiplicadorDe,
} from '../src/juiz.js';

test('a conta fecha na unha: k(k-1) = v-1 em toda ordem', () => {
  for (let q = 2; q <= 20; q++) {
    const v = tamanhoDoGrupo(q);
    const k = tamanhoDoConjunto(q);
    assert.equal(k * (k - 1), v - 1, 'q=' + q);
  }
});

test('{0, 1, 3} e conjunto de diferencas modulo 7, e {0, 1, 2} nao e', () => {
  assert.equal(ehConjuntoDeDiferencas([0, 1, 3], 7), true);
  assert.equal(ehConjuntoDeDiferencas([0, 1, 2], 7), false);
  assert.equal(ehConjuntoDeDiferencas([0, 2, 3], 7), true);
});

test('o criterio recusa conjunto de tamanho errado', () => {
  assert.equal(ehConjuntoDeDiferencas([0, 1, 3, 4], 7), false);
  assert.equal(ehConjuntoDeDiferencas([0, 1], 7), false);
});

test('as diferencas de um conjunto sao k(k-1) e cobrem todo resto nao nulo', () => {
  for (let q = 2; q <= 5; q++) {
    const v = tamanhoDoGrupo(q);
    const k = tamanhoDoConjunto(q);
    for (const c of todos(q)) {
      const d = diferencas(c, v);
      assert.equal(d.length, k * (k - 1));
      assert.deepEqual([...new Set(d)].sort((a, b) => a - b), Array.from({ length: v - 1 }, (_, i) => i + 1));
    }
  }
});

test('todo conjunto achado pela busca passa pelo criterio ingenuo', () => {
  for (let q = 2; q <= 7; q++) {
    const v = tamanhoDoGrupo(q);
    for (const c of todos(q)) {
      assert.equal(ehConjuntoDeDiferencas(c, v), true, 'q=' + q + ' ' + c.join(','));
    }
  }
});

test('todo conjunto achado comeca no zero e e crescente', () => {
  for (let q = 2; q <= 7; q++) {
    for (const c of todos(q)) {
      assert.equal(c[0], 0);
      for (let i = 1; i < c.length; i++) assert.ok(c[i] > c[i - 1], c.join(','));
    }
  }
});

test('a busca nao devolve conjunto repetido', () => {
  for (let q = 2; q <= 7; q++) {
    const chaves = todos(q).map((c) => c.join(','));
    assert.equal(new Set(chaves).size, chaves.length, 'q=' + q);
  }
});

test('a ordem 6 nao tem nenhum conjunto, e a busca abre 330.348 nos para provar', () => {
  const r = varrer(6);
  assert.equal(r.v, 43);
  assert.equal(r.k, 7);
  assert.equal(r.total, 0);
  assert.equal(r.nos, 330_348);
});

test('os nos sem poda sao a soma dos binomiais, e nao C(v-1, k-1)', () => {
  assert.equal(binomial(6, 2), 15n);
  assert.equal(subconjuntos(2), 15n);
  assert.equal(nosSemPoda(2), 6n + 15n);
  for (let q = 2; q <= 7; q++) assert.ok(nosSemPoda(q) > subconjuntos(q), 'q=' + q);
});

test('a poda sempre abre menos nos que a busca sem poda', () => {
  for (let q = 2; q <= 7; q++) {
    assert.ok(BigInt(varrer(q).nos) < nosSemPoda(q), 'q=' + q);
  }
});

test('normalizar e menorDeslocamento nao mudam ser conjunto de diferencas', () => {
  const v = 13;
  for (const c of todos(3)) {
    const deslocado = c.map((x) => (x + 5) % v);
    assert.deepEqual(normalizar(deslocado, v).length, c.length);
    assert.equal(ehConjuntoDeDiferencas(deslocado, v), true);
    assert.equal(menorDeslocamento(deslocado, v), menorDeslocamento(c, v));
  }
});

test('multiplicar por um invertivel leva conjunto de diferencas em outro', () => {
  for (const q of [2, 3, 4, 5]) {
    const v = tamanhoDoGrupo(q);
    for (const c of todos(q)) {
      for (const m of invertiveis(v)) {
        const imagem = c.map((x) => (x * m) % v);
        assert.equal(ehConjuntoDeDiferencas(imagem, v), true, 'q=' + q + ' m=' + m);
      }
    }
  }
});

test('as classes particionam os conjuntos: nada sobra, nada repete', () => {
  for (const q of [2, 3, 4, 5, 7]) {
    const grupos = classes(q);
    const chaves = grupos.flat();
    assert.equal(new Set(chaves).size, chaves.length, 'q=' + q);
  }
});

test('o cubico achado nao tem raiz no corpo', () => {
  for (const p of primos(20)) {
    const c = cubicoIrredutivel(p);
    assert.ok(c !== null, 'p=' + p);
    for (let x = 0; x < p; x++) {
      const valor = (((x * x % p) * x % p) + c.a * x * x + c.b * x + c.c) % p;
      assert.notEqual(valor, 0, 'p=' + p + ' raiz em ' + x);
    }
  }
});

test('a multiplicacao no corpo tem 1 como neutro e e comutativa', () => {
  const p = 5;
  const poli = cubicoIrredutivel(p);
  for (let a = 0; a < p; a++) {
    for (let b = 0; b < p; b++) {
      const u = [a, b, 1];
      const w = [b, 1, a];
      assert.deepEqual(multiplicar(u, [1, 0, 0], p, poli), u);
      assert.deepEqual(multiplicar(u, w, p, poli), multiplicar(w, u, p, poli));
    }
  }
});

test('Singer entrega conjunto de diferencas de tamanho q+1, para q primo', () => {
  for (const q of [2, 3, 5, 7, 11]) {
    const c = singer(q);
    assert.ok(c !== null, 'q=' + q);
    assert.equal(c.length, tamanhoDoConjunto(q));
    assert.equal(ehConjuntoDeDiferencas(c, tamanhoDoGrupo(q)), true, 'q=' + q);
  }
});

test('a varredura encontra o conjunto que Singer constroi', () => {
  for (const q of [2, 3, 5, 7]) {
    const v = tamanhoDoGrupo(q);
    const chave = menorDeslocamento(singer(q), v);
    assert.ok(todos(q).some((c) => menorDeslocamento(c, v) === chave), 'q=' + q);
  }
});

test('o teorema do multiplicador vale em todo conjunto achado', () => {
  for (const q of [2, 3, 4, 5, 7]) {
    const v = tamanhoDoGrupo(q);
    const p = primoDaPotencia(q);
    for (const c of todos(q)) {
      const t = multiplicadorDe(c, v, p);
      assert.notEqual(t, null, 'q=' + q + ' ' + c.join(','));
    }
  }
});

test('Bruck-Ryser-Chowla proibe 6 e 14, e nao proibe 10', () => {
  assert.equal(brcProibe(6), true);
  assert.equal(brcProibe(14), true);
  assert.equal(brcProibe(10), false);
  assert.deepEqual(somaDeDoisQuadrados(10), [1, 3]);
  assert.equal(somaDeDoisQuadrados(6), null);
});

test('BRC nunca proibe uma ordem que e potencia de primo', () => {
  for (let q = 2; q <= 60; q++) {
    if (primoDaPotencia(q) !== null) assert.equal(brcProibe(q), false, 'q=' + q);
  }
});

test('toda ordem que BRC proibe tem zero conjuntos na varredura', () => {
  for (let q = 2; q <= 8; q++) {
    if (brcProibe(q)) assert.equal(quantos(q), 0, 'q=' + q);
  }
});
