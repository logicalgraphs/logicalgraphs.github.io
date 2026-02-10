// assume EMA-20s chart is a canvas called 'pivotChart'
// assume deltas chart is a canvas called 'deltaChart'

const pivotCharts = (primary, secondary, data) => {
   let [table, idx] = pivotTable(data);
   pivotChartsTbl(primary, secondary, table, idx);
}

const pivotChartsTbl = (primary, secondary, table, idx) => {
   let prims = row(table, idx, primary);
   let secs = row(table, idx, secondary);
   let dates = row(table, idx, 'date').slice(-100);
   let ratio0 = ratios(prims, secs);
   let ema20s0 = emas(ratio0, 20);

   let [ds, mins, maxs] = deltas(ratio0, ema20s0, 100);

   let title = primary + '/' + secondary;
   const ratios1 = line(title, ratio0.slice(-100), 'dodgerblue');
   const sma100s = line('SMA-100', smas(ratio0, 100).slice(-100), 'lime');
   const ema20s = line('EMA-20', ema20s0.slice(-100), 'tomato');

   drawDeltas(dates, ds, mins, maxs);
   drawLineChart(dates, [ratios1, sma100s, ema20s], 'pivotChart');
   return drawRec(dates, ds, mins, maxs, primary, secondary);
};

const drawDeltas = (dates, ds, mins, maxs) => {
   const ctx1 = document.getElementById('deltaChart').getContext('2d');

   const rgba = (r, g, b, a) =>
      'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
   const line = (label, d, r, g, b) => {
      return {
         label: label + ' δ',
         data: d.slice(-100).slice(1),
         borderColor: rgba(r, g, b, '1'),
         backgroundColor: rgba(r, g, b, '0.2'),
         fill: false,
         type: 'line'
      };
   };
      
   new Chart(ctx1, {
      type: 'bar',
      data: {
         labels: dates,
         datasets: [ {
               label: 'δ',
               data: ds.slice(-100),
               backgroundColor: 'rgba(255, 159, 64, 0.6)',
               type: 'bar'
            },
            line('Max', maxs, '75', '192', '192'),
            line('Min', mins, '153', '102', '255')
         ]
      },
      options: {
         responsive: true,
         plugins: {
            legend: { labels: { color: 'white' } },
            customCanvasBackgroundColor: { color: 'black' } },
         scales: { y: { beginAtZero: false } }
      },
      plugins: [plugin]
   });
};

const drawRec = (dates, ds, mins, maxs, prim, sec) => {

   const ultimate = arr => arr[arr.length - 1];
   const penultimate = arr => arr[arr.length - 2];
   const arr = (a, b) => a + " -> " + b;
   let d = ultimate(ds);

   let call = "For " + ultimate(dates) + ", SWAP ";
   let swap = (d < 0) ? arr(sec, prim) : arr(prim, sec);
   let dem = penultimate((d < 0) ? mins : maxs);

   let conf0 = d / dem;
   let conf = (conf0 * 100) | 0;

   const field = document.getElementById('recommendation');

   if (field) {
      let msg = call + swap + ", δ-confidence: " + conf + "%";
      field.innerText = msg;
   }
   return (d < 0);
};
