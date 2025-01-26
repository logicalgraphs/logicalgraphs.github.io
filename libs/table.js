const id = x => x;

const table = (data, separator='\t', offset=0, f=id) => {
   const lines = data.split('\n').map(s => s.trim());

   const labels0 = [];

   const indices = {};
   const orDate = v => { 
      let ans = v;
      if (v === "") { ans = "date"; }
      return ans;
   }
   lines[0 + offset].split(separator).map((v, i) => indices[orDate(v)] = i);

   const table = [];
   lines.slice(1 + offset).map(row => {
      if (row.length > 10) {
         const cols = row.split(separator);
         table.push([cols[0]].concat(cols.slice(1).map(f)));
      }
   });
   return [table, indices];
};

const orderedIndices = idx => {
   let labels = [];
   for (let [k, v] of Object.entries(idx)) {
      labels.push([v, k]);
   }
   labels.sort();
   let orderedLabels = labels.map(([v, k]) => [k, v]);
   return orderedLabels;
};

const row = (table, idx, key) => table.map(r => r[idx[key]]);

const sampleRow = table => {
   let idx = (Math.random() * table.length) | 0;
   return [table[idx], idx];
};

// we assume the date is in column 0 for our tables, because duh!

const sortByDate = t => t.sort((a, b) => new Date(a[0]) - new Date(b[0]));

const sortedTable = (data, separator='\t', offset=0, f=id) => {
   let [t, idx] = table(data, separator, offset, f);
   sortByDate(t);
   return [t, idx];
};
