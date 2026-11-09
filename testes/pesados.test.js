// A varredura grande, separada porque passa de meio minuto: a ordem 9, com
// 486.530.121 nos abertos e as classes de equivalencia de 120 conjuntos num
// grupo de 91 elementos.
//
// A ordem 10 e o proximo caso proibido conhecido, e nao esta aqui: a prova de
// que ela nao existe e de 1989, de Lam, Thiel e Swiercz, e levou milhares de
// horas de processamento num supercomputador. Este retrocesso nao termina.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { varrer, classes, quantos, nosSemPoda, subconjuntos, tamanhoDoGrupo } from '../src/diferencas.js';
import { singer, multiplicadorDe, primoDaPotencia } from '../src/juiz.js';
import { todos, menorDeslocamento } from '../src/diferencas.js';

const DEZ_MINUTOS = 600_000;

let nove = null;
function ordem9() {
  if (nove === null) nove = varrer(9);
  return nove;
}

test('ordem 9: 120 conjuntos em 486.530.121 nos', { timeout: DEZ_MINUTOS }, () => {
  const r = ordem9();
  assert.equal(r.v, 91);
  assert.equal(r.k, 10);
  assert.equal(r.total, 120);
  assert.equal(r.nos, 486_530_121);
  assert.equal(nosSemPoda(9), 791_908_666_288n);
  assert.equal((Number(nosSemPoda(9)) / r.nos).toFixed(1), '1627.7');
  assert.equal(subconjuntos(9), 706_252_528_630n);
});

test('a ordem 9 tambem tem uma classe de equivalencia so', { timeout: DEZ_MINUTOS }, () => {
  const grupos = classes(9);
  assert.equal(grupos.length, 1);
  assert.equal(grupos[0].length, 12);
  assert.equal(quantos(9), 120);
});

test('o multiplicador 3 vale nos 120 conjuntos da ordem 9', { timeout: DEZ_MINUTOS }, () => {
  const v = tamanhoDoGrupo(9);
  assert.equal(primoDaPotencia(9), 3);
  for (const c of todos(9)) {
    assert.notEqual(multiplicadorDe(c, v, 3), null, c.join(','));
  }
});

test('Singer nao alcanca a ordem 9, mas a varredura alcanca', { timeout: DEZ_MINUTOS }, () => {
  // 9 e potencia de primo, mas nao e primo: o corpo de 9^3 elementos nao sai de
  // polinomios sobre os inteiros modulo 9, e a construcao daqui para antes.
  assert.equal(singer(9), null);
  assert.equal(primoDaPotencia(9), 3);
  assert.equal(quantos(9), 120);
  const v = tamanhoDoGrupo(9);
  const chaves = new Set(todos(9).map((c) => menorDeslocamento(c, v)));
  assert.equal(chaves.size, 12);
});
