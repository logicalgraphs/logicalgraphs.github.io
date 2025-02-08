const pieChart = (wallets, idx, canvasName, labelRow, randomizeColors = false,
                  position='right', chartType='pie') => {
   let tvls = row(wallets, idx, 'TVL').map(parseUSD);
   let dappsTvl = {};
   let dapprow = row(wallets, idx, labelRow);
   dapprow.forEach((label, ix) => {
      if (dappsTvl[label]) {
         dappsTvl[label] += tvls[ix];
      } else {
         dappsTvl[label] = tvls[ix];
      }
   });
   let labels = [];
   let amounts = [];
   for (dapp in dappsTvl) {
      labels.push(dapp);
      amounts.push(dappsTvl[dapp]);
   }
   doughnutChartTbl(labels, amounts, canvasName, 
                    randomizeColors, chartType, position);
};

const tokenChart = (wallets, idx, canvasName, randomizedColors = false,
                    position = 'left', chartType='doughnut') => {
   let amounts = [];
   let labels = usdLabels(idx).map(([lab, ix]) => {
      let tot = total(wallets.map(row => row[ix]));
      amounts.push(tot);
      return lab;
   });
   doughnutChartTbl(labels, amounts, canvasName, randomizedColors,
                    chartType, position);
   return showUsd(sum(amounts));
};

const doughnutChartTbl = (labels, amounts, canvasName, randomizeColors = false,
                          chartType='doughnut', position='left') => {
   const ctx = document.getElementById(canvasName).getContext('2d');

   let fiver = amounts.reduce((acc, ans) => acc + ans, 0) * 0.05;
   let others = 0;
   let ix = 0;
   let kinds = [];
   let amts = [];
   labels.forEach(kind => {
      let amt = amounts[ix++];
      if(amt < fiver) { others += amt } else {
         amts.push(amt);
         kinds.push(kind);
      }
   });
   if(others > 0) { amts.push(others); kinds.push('others'); }
   let slices = randomizeColors ? undefined : kinds.map(colorOf);

   new Chart(ctx, {
      type: chartType,
      data: {
         labels: kinds,
         datasets: [{
            label: 'TVL $',
            data: amts,
            backgroundColor: slices
         }],
      },
      options: {
         aspectRatio: 1.75,
layout: {
        padding: {
            left: 50,
            right: 0,
            top: 10,
            bottom: 10
        }
    },
         responsive: true,
         plugins: {
            legend: { position: position, align: 'start',
                      labels: { color: 'white' }
            }
         }
      } 
   });
};
