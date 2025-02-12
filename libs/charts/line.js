const drawLineChart = (dates, lines, canvas='lineChart') => {

   const ctx = document.getElementById(canvas).getContext('2d');

   new Chart(ctx, {
      type: 'line',
      data: { labels: dates, datasets: lines },
      options: { 
         plugins: { 
            legend: { labels: { color: 'white' } },
            customCanvasBackgroundColor: { color: 'black' } } },
      plugins: [plugin]
   });
};

const line = (label, data, color) => {
   return { label: label, data: data, borderColor: color, fill: false } 
};
