const pivotsUrl = 'https://raw.githubusercontent.com/logicalgraphs/crypto-n-rust/refs/heads/main/data-files/csv/pivots.csv';

const pivotTable = data => table(data, ',', 1, parseFloat);

const poolName = (vars, sep) => vars['p1'] + sep + vars['p2'];
