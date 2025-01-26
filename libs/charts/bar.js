const barChart = data => {
   let [assets, idx] = sortedTable(data);
   const labels = usdLabels(idx);
   barChartTbl(labels, parseData(assets, labels));
};

const tvlChart = data => {
   let [assets, idx] = sortedTable(data);
   let labels = orderedIndices(idx).slice(1);
   barChartTbl(labels, parseData(assets, labels));
};

const parseData = (assets, labels) => {
   let data = assets.map(columns => {
      const daters = {};
      labels.forEach(([k, i]) => { daters[k] = parseUSD(columns[i]); });
      return {
         date: columns[0],
         data: daters
      };
   });
   return data;
};

const barChartTbl = (labels, parsedData) => {
    let amounts = {};
    const dates = [];
    parsedData.forEach(row => {
        dates.push(row.date);
        for(let asset in row.data) { 
           let datum = row.data[asset];
           if (amounts[asset]) {
              amounts[asset].push(datum);
           } else {
              amounts[asset] = [datum];
           }
        }
    });

    let datasets = [];
    // const myColors = colors();
    const mkSet = asset => {
       return {
          label: asset,
          data: amounts[asset],
          backgroundColor: colorOf(asset)  // randomColor(myColors)
       };
    };
    for (let amount in amounts) { datasets.push(mkSet(amount)); };

    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: datasets,
        },
        options: {
            responsive: true,
            plugins: {
               legend: { labels: { color: 'white' } },
               customCanvasBackgroundColor: { color: 'black' }
            },
            scales: { x: { stacked: true }, y: { stacked: true } }
        },
        plugins: [plugin]
    });
};
