const sum_last = (data, index, range) => sum(data.slice(index - range, index));
const sum = data => data.reduce((a,b) => a + b, 0);

const avg_last = (data, index, range) => avg(data.slice(index - range, index));
const avg = data => sum(data) / data.length;

const smas = (data, window) => {
   let sma = [];
   let w1 = window-1;
   for (let i = 0; i < w1; i++) { sma.push(null); }
   for (let i = w1; i < data.length; i++) {
      sma.push(avg_last(data, i, window));
   }
   return sma;
};

const emas = (data, window) => {
   let ema = [];
   let multiplier = 2 / (window + 1);
   let w1 = window-1;
   for (let i = 0; i < w1; i++) { ema.push(null); }
   ema.push(avg_last(data, w1, w1));
   for (let i = window; i < data.length; i++) {
      ema.push(data[i] * multiplier + ema[i-1] * (1 - multiplier));
   }
   return ema;
};

const deltas = (data, emas, window) => {
   let deltas = data.map((v, i) => v - emas[i]);
   let minDeltas = [];
   let maxDeltas = [];
   for (let x = 0; x < deltas.length; x++) {
      let start = Math.max(0, x-100);
      let minDelt = Math.min( ... deltas.slice(start, x));
      let maxDelt = Math.max( ... deltas.slice(start, x));
      minDeltas.push(minDelt);
      maxDeltas.push(maxDelt);
   }

   return [deltas, minDeltas, maxDeltas];
};  

const ratios = (row1, row2) => row1.map((v, i) => v / row2[i]);
