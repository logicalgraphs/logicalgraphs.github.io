
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
   let kinds = tokenByKind(wallets, idx, kind);
   let vs = sets(kinds);
   let chart = venn.VennDiagram();
   d3.select('#' + canvas).datum(vs).call(chart);
};
