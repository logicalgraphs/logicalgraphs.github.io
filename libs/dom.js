const params = () => {
    var url = window.location.search.substring(1);
    var query = url.split('&');
    let ans = {};
    query.forEach(pair => {
       let [a, b] = pair.split('=');
       ans[a] = decodeURIComponent(b);
    });
    return ans;
};

const poolName = (vars, sep) => vars['p1'] + sep + vars['p2'];

const replaceText = (eltClass, txt) => {
   let elts = document.getElementsByClassName(eltClass);
   if(elts) {
      Array.prototype.forEach.call(elts, elt => elt.textContent = txt);
   }
};

async function populatePivotPoolUX(graphf, piep, canvasName='pieChart') {
   let vars = params();

   let pp = poolName(vars, '+');
   if(!vars['title']) { vars['title'] = pp + ' Pivot'; }
   if(!vars['file']) { vars['file'] = poolName(vars, '-').toLowerCase(); }

   replaceText('title', vars['title']);
   replaceText('pair', pp);

   document.getElementById('screens').href =
      "diy.html?t1=" + poolName(vars, '&t2=');

   let d = document.getElementById('detail');
   if(d) { d.href = "detail.html?p1=" + poolName(vars, '&p2='); }

   let fileName = 'data/pools/' + vars['file'] + '.tsv';

   fetch(fileName).then(response => response.text())
      .then(data => graphf(data));

   if(piep) {
      fetch('data/wallets.tsv').then(response => response.text())
         .then(data => {
            let [wallets, idx] = table(data);
            let pool = wallets.filter(row => row[idx['pool']] === pp);
            pieChart(wallets, idx, canvasName, 'pool');
      });
   }
}

// ----- Pool-indexing --------------------------------------------------

const mkUrl = (row, idx) =>
   "pool.html?p1=" + row[idx['p1']] + "&p2=" + row[idx['p2']];

const poolRow = (pool, row, idx, hrefIx, nonpool=false) => {
   return {
      pool: pool,
      href: nonpool? row[hrefIx] : mkUrl(row, idx),
      incept: row[idx['incept']],
      roi: row[idx['ROI']],
      apr: row[idx['APR']],
      tvl: parseUSD(row[idx['TVL']])
   };
};

const datum = (row, ix, txt) => {
   let cell = row.insertCell(ix);
   cell.innerHTML = txt;
};

const pivotTR = (tableId, rowIx, row) => {
  // ooh! DOM-manipulation henceforth!
  let table = document.getElementById(tableId);
  let tr = table.insertRow(rowIx); // remember: we already have a header row
  let { pool, href, incept, roi, apr, tvl } = row;
  datum(tr, 0, "<a href='" + href + "'>" + pool + "</a>");
  datum(tr, 1, incept);
  datum(tr, 2, showUsd(tvl));
  datum(tr, 3, roi);
  datum(tr, 4, apr);
};

async function indexPools() {
   fetch('data/wallets.tsv').then(result => result.text()).then(data => {
      let pools = [];
      const nonPools = [];
      let tot = 0;

      let [wallets, idx] = table(data);
      let hrefIx = idx['href'];
      let dappIx = idx['dapp'];
      let tvlIx = idx['TVL'];
      let tpSet = new Set(['pools', 'treasury']);
      let poolRows =
         wallets.filter(row => tpSet.has(row[dappIx])
                            && parseUSD(row[tvlIx]) > 0);
      poolRows.forEach(row => {
         let pool = row[idx['pool']];
         tot += parseUSD(row[tvlIx]);
         if(pool === 'n/a') {
            nonPools.push(poolRow(row[idx['name']], row, idx, hrefIx, true));
         } else { pools.push(poolRow(pool, row, idx, hrefIx)); }
      });

      replaceText('tvl', showUsd(tot));

      let rowIx = 4;
      pools.sort((a, b) => b.tvl > a.tvl ? 1 : -1)
           .forEach(row => pivotTR("poolTable", rowIx++, row));
      let stakeIx = rowIx + 2; // to hop over the horizontal rule
      nonPools.forEach(row => pivotTR("poolTable", stakeIx++, row));

      let pivots = wallets.filter(row => row[dappIx] === 'pools');
      vennTbl(pivots, idx, 'vennChart');
   });
}
