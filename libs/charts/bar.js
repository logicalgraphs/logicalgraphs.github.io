const barChart = data => {
   let [assets, idx] = sortedTable(data);
   const labels = usdLabels(idx);
   barChartTbl(labels, assets);
};

const tvlChart = data => {
   let [assets, idx] = sortedTable(data);
   let labels = orderedIndices(idx).slice(1);
   barChartTbl(labels, assets);
};

const barChartTbl = (labels, assets) => {
   let parsedData = parseData(assets, labels);
   barChartTbl1(labels, parsedData);
};

const barChartTbl1 = (labels, parsedData) => {
    let amounts = {};
    const dates = [];
    let total = 0;
    parsedData.forEach(row => {
        dates.push(row.kind);
        for(let asset in row.data) { 
           let key = asset;
           let datum = row.data[key];
           if (amounts[asset]) {
              amounts[asset].push(datum);
           } else {
              amounts[asset] = [datum];
           }
           total += datum;
        }
    });
    let fiver = 0.05 * total;
    let datasets = [];
    const mkSet = asset => {
       return {
          label: asset,
          data: amounts[asset],
          backgroundColor: colorOf(asset)
       };
    };
    let summer = list => { return list.reduce((acc, a) => acc + a, 0); };
    let other = { label: 'other', data: [], backgroundColor: 'lightGray' };
    let first = true;
    for (let asset in amounts) { 
       let amts = amounts[asset];
       if(summer(amts) < fiver) {
          if(first) {
             other.data = amts;
             first = false;
          } else {
             let thunk = [];
             let ix = 0;
             other.data.forEach(d => { thunk.push(d + amts[ix++]); });
             other.data = thunk;
          }
       } else {
          datasets.push(mkSet(asset));
       }
    }
    if(!first) { datasets.push(other); }

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
