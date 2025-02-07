const parseUSD = str => parseFloat(str.replace('$', '').replace(',', ''));

const total = row => row.reduce((acc, x) => parseUSD(x) + acc,0);

// because kv-objects don't have .filter(), le sigh.

const fetchLabels = (idx, labelf) => {
   const labels = [];
   for (let k in idx) {
      let lab = labelf(k);
      if (lab) {
         let ix = idx[k];
         labels.push([lab, ix]);
      }
   }
   return labels;
};

const usdLabelf = k => {
   if(k.endsWith('$')) { return k.slice(0, -2); }
};

const usdLabels = idx => {
   return fetchLabels(idx, usdLabelf);
};

const showUsd = n => {
   let d = Math.floor(n);
   let c = Math.floor((n - d) * 100);
   let cents = c === 0 ? "00" : c < 10 ? "0" + c : c;
   return "$" + d + '.' + cents;
};
