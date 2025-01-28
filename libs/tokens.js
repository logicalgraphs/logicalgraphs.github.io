// reduces a table to token-dollar amounts
// then further reduces table to like-kind token-dollar amounts

// first: define like-kinds

const tokenGroup = {
   "sAVAX": "AVAX",
   "wstETH": "ETH"
};

const likeKind = tok => {
   let mb = tokenGroup[tok];
   let ans = mb ? mb : tok;
   if(tok.includes('USD')) { ans = "stable"; }
   return ans;
};

// reduce the table by a column for the type and to the USD-crypto amounts

const parseData = (assets, labels, ix=0) => {
   let data = assets.map(columns => {
      const daters = {};
      labels.forEach(([k, i]) => { daters[k] = parseUSD(columns[i]); });
      return {
         kind: columns[ix],
         data: daters
      };
   });
   return data;
};

const kindSum = row => {
   let acc = 0;
   for(let col in row) { acc += row[col]; }
   return acc;
};

const tokSum = (hier, tok) => {
   let acc = 0;
   for(let kind in hier) { acc += hier[kind][tok]; }
   return acc;
};

const refine = kinds => {
   let gold = {};
   for(let kind in kinds) {
      let silver = {};
      let row = kinds[kind];
      for(tok in row) {
         let lk = likeKind(tok);
         let amt = silver[lk];
         let more = row[tok];
         silver[lk] = amt ? amt + more : more;
      }
      gold[kind] = silver;
   }
   return gold;
};

const tokenByKind = (table, idx, kind) => {
   let hier = {};
   let rawLabels = usdLabels(idx);
   let grid = parseData(table, usdLabels(idx), idx[kind]);
   let sum = (a, b) => {
      let ans = {};
      for(let ix in a) { ans[ix] = a[ix] + b[ix]; }
      return ans;
   };
   grid.forEach(row => {
      let dater = row.data;
      let kimd = row.kind;
      let acc = hier[kimd];
      hier[kimd] = acc ? sum(dater, acc) : dater;
   });
   return refine(hier);
};
