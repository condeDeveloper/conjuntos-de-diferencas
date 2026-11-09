// O medidor: roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js         todas
//   node ferramentas/medidor.js brc     so uma
//
// Nenhum numero do README e digitado a mao: sai daqui.
//
// As tabelas daqui param na ordem 8. A ordem 9 esta nos testes pesados: as
// classes de equivalencia dela sozinhas levam mais tempo que todo o resto.

import {
  tabelaVarredura,
  tabelaClasses,
  tabelaBRC,
  tabelaSinger,
  tabelaMultiplicador,
  tabelaDiferencas,
} from '../src/medidas.js';

const num = (x) => (typeof x === 'bigint' || typeof x === 'number' ? x.toLocaleString('pt-BR') : String(x));
const dec = (x, c = 1) => x.toLocaleString('pt-BR', { minimumFractionDigits: c, maximumFractionDigits: c });

function imprimir(titulo, colunas, linhas) {
  console.log('\n### ' + titulo);
  const larguras = colunas.map((c, i) => Math.max(c.length, ...linhas.map((l) => String(l[i]).length)));
  const linha = (cs) => '| ' + cs.map((c, i) => String(c).padStart(larguras[i])).join(' | ') + ' |';
  console.log(linha(colunas));
  console.log('|' + larguras.map((w) => '-'.repeat(w + 2)).join('|') + '|');
  for (const l of linhas) console.log(linha(l));
}

const tabelas = {
  varredura() {
    imprimir(
      'A varredura por ordem, e o que a poda economiza',
      ['q', 'v = q^2+q+1', 'k = q+1', 'conjuntos', 'nos abertos', 'nos sem poda', 'razao', 'subconjuntos', 'q e potencia de primo'],
      tabelaVarredura(8).map((l) => [
        l.q, num(l.v), l.k, num(l.conjuntos), num(l.nos), num(l.semPoda),
        dec(l.razao) + 'x', num(l.subconjuntos), l.ehPotenciaDePrimo ? 'sim' : 'NAO',
      ])
    );
  },

  classes() {
    imprimir(
      'As classes de equivalencia: quantos planos projetivos ciclicos',
      ['q', 'conjuntos', 'classes', 'tamanho da classe', 'invertiveis mod v', 'ordem de p', 'tamanho x ordem = invertiveis'],
      tabelaClasses(8).map((l) => [
        l.q, num(l.conjuntos), num(l.classes), l.tamanho === null ? '-' : num(l.tamanho),
        num(l.phi), l.ordemDoP === null ? '-' : num(l.ordemDoP),
        l.bate === null ? '-' : l.bate ? 'sim' : 'NAO',
      ])
    );
  },

  brc() {
    imprimir(
      'Bruck-Ryser-Chowla contra a varredura',
      ['q', 'q mod 4', 'soma de dois quadrados', 'BRC proibe', 'potencia de primo', 'varrido', 'encontrados'],
      tabelaBRC(12, 8).map((l) => [
        l.q, l.restoPor4,
        l.somaDeDoisQuadrados ? l.somaDeDoisQuadrados[0] + '^2 + ' + l.somaDeDoisQuadrados[1] + '^2' : 'nao e',
        l.brcProibe ? 'SIM' : 'nao', l.ehPotenciaDePrimo ? 'sim' : 'nao',
        l.varrido ? 'sim' : 'nao', l.encontrados === null ? '-' : num(l.encontrados),
      ])
    );
  },

  singer() {
    imprimir(
      'A construcao de Singer, de 1938 (so para q primo)',
      ['q', 'conjunto', 'tamanho', 'e q+1', 'passa no criterio', 'a varredura acha'],
      tabelaSinger(11).filter((l) => l.conjunto !== null).map((l) => [
        l.q, '{' + l.conjunto.join(', ') + '}', l.tamanho, l.tamanho === l.esperado ? 'sim' : 'NAO',
        l.valido ? 'sim' : 'NAO', l.achado === null ? '-' : l.achado ? 'sim' : 'NAO',
      ])
    );
  },

  multiplicador() {
    imprimir(
      'O teorema do multiplicador conferido em todo conjunto',
      ['q', 'p', 'conjuntos', 'falhas', 'deslocamentos distintos'],
      tabelaMultiplicador(8).map((l) => [
        l.q, l.p === null ? '-' : l.p, num(l.conjuntos), num(l.falhas), num(l.deslocamentosDistintos),
      ])
    );
  },

  diferencas() {
    imprimir(
      'As diferencas conferidas pelo criterio ingenuo',
      ['q', 'v', 'k', 'conjuntos', 'diferencas por conjunto', 'restos nao nulos', 'cabe na unha', 'todos validos'],
      tabelaDiferencas(8).map((l) => [
        l.q, num(l.v), l.k, num(l.conjuntos), num(l.diferencasPorConjunto), num(l.restosNaoNulos),
        l.cabeNaUnha ? 'sim' : 'NAO', l.todosValidos ? 'sim' : 'NAO',
      ])
    );
  },
};

const pedido = process.argv[2];
if (pedido && !tabelas[pedido]) {
  console.error('tabela desconhecida: ' + pedido);
  console.error('disponiveis: ' + Object.keys(tabelas).join(', '));
  process.exit(1);
}
for (const [nome, fn] of Object.entries(tabelas)) {
  if (!pedido || pedido === nome) fn();
}
console.log();
