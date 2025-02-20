
const sets = kinds => {
   let ans = [];

   let pushSum = (list, names, sum) => {
      if(sum > 0) { list.push({ sets: names, size: sum }); }
   }
   for(let kind in kinds) {
      let row = kinds[kind];
      pushSum(ans, [kind], kindSum(row));
      for(let tok in row) { pushSum(ans, [tok, kind], row[tok]); }
   }
   for(tok in Object.values(kinds)[0]) {
      pushSum(ans, [tok], tokSum(kinds, tok));
   }
   return ans;
};

const vennChart = (data, canvas, kind='dapp') => {
   let [wallets, idx] = table(data);
   vennTbl(wallets, idx, canvas, kind);
};

const vennTbl = (table, idx, canvas, kind='blockchain') => {
   let kinds = tokenByKind(table, idx, kind);
   let vs = sets(kinds);
   let chart = venn.VennDiagram();
   let div = d3.select('#' + canvas);
   div.datum(vs).call(chart);
   
// add a tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "venntooltip");

// add listeners to all the groups to display tooltip on mouseover
div.selectAll("g")
    .on("mouseover", function(d, i) {
        // sort all the areas relative to the current item
        venn.sortAreas(div, d);

        // Display a tooltip with the current size
        tooltip.transition().duration(400).style("opacity", .9);
        tooltip.text(d.sets + ': ' + showUsd(d.size));
        
        // highlight the current path
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("stroke-width", 3)
            .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
            .style("stroke-opacity", 1);
    })

    .on("mousemove", function() {
        tooltip.style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
    })
    
    .on("mouseout", function(d, i) {
        tooltip.transition().duration(400).style("opacity", 0);
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("stroke-width", 0)
            .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
            .style("stroke-opacity", 0);
    });
};
