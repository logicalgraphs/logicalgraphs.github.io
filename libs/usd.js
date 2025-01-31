const parseUSD = str => parseFloat(str.replace('$', '').replace(',', ''));

const total = row => row.reduce((acc, x) => parseUSD(x) + acc,0);

// because kv-objects don't have .filter(), le sigh.

const usdLabels = idx => {
   const labels = [];
   for (let k in idx) {
      if (k.endsWith('$')) {
         let ix = idx[k];
         labels.push([k.slice(0, -2), ix]);
      }
   }
   return labels;
};

const showUsd = n => {
   let d = Math.floor(n);
   let c = Math.floor((n - d) * 100);
   let cents = c === 0 ? "00" : c < 10 ? "0" + c : c;
   return "$" + d + '.' + cents;
};
