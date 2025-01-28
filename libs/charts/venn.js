
const sets = kinds => {
   let ans = [];

   let pushSum = (list, names, sum) => {
      if(sum > 0) { list.push({ sets: names, size: sum }); }
   }
   for(let kind in kinds) {
      let row = kinds[kind];
      pushSum(ans, [kind], kindSum(row));
      for(let tok in row) { pushSum(ans, [tok, kind], row[tok]); }
   }
   for(tok in kinds['treasury']) { pushSum(ans, [tok], tokSum(kinds, tok)); }
   return ans;
};

const vennChart = (data, canvas, kind='dapp') => {
   let [wallets, idx] = table(data);
   vennTbl(wallets, idx, canvas, kind);
};

const vennTbl = (table, idx, canvas, kind='dapp') => {
   let kinds = tokenByKind(table, idx, kind);
   let vs = sets(kinds);
   let chart = venn.VennDiagram();
   d3.select('#' + canvas).datum(vs).call(chart);
};
