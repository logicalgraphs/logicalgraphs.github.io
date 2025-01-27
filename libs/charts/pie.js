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

const doughnutChartTbl = (labels, amounts, canvasName, randomizeColors = false,
                          chartType='doughnut', position='left') => {
   const ctx = document.getElementById(canvasName).getContext('2d');

   let slices =
      randomizeColors ? undefined : labels.map(token => colorOf(token));

   new Chart(ctx, {
      type: chartType,
      data: {
         labels: labels,
         datasets: [{
            label: 'TVL $',
            data: amounts,
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
