<template>
  <div id="linktree"></div>
</template>
<script>
import * as d3 from "d3";
import data from "../../public/static/data.json";
export default {
  data() {
    return {
      drawdata: null,
    };
  },
  methods: {
    init() {
      let width = document.getElementById("linktree").clientWidth;
      let height = document.getElementById("linktree").clientHeight;
      let tree = this.treescale(width, height);

      let svg = d3
        .select("#linktree")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      const root = tree(data)
      let x0 = Infinity;
      let x1 = -x0;
      root.each((d) => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      });
      const g = svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);

      let links = root.links();
      const link = g
        .append("g")
        .attr("transform", "translate(" + 20 + "," + 10 + ")")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr(
          "d",
          // d3
          //     .linkHorizontal()
          d3
            .linkVertical()
            .x((d) => d.x)
            .y((d) => d.y)
        );
       let nodes = root.descendants()
      const node = g
        .append("g")
        .attr("transform", "translate(" + 20 + "," + 10 + ")")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll("g")
        .data(nodes)
        .join("g");
         node
            .append("circle")
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
            .attr("fill", (d) => (d.children ? "#555" : "#999"))
            .attr("r", function(d){
                return 1.5
            })
            .append('title')
            .text(d => d.data.name);
    },
    treescale: function (width, height) {
      let tree = (data) =>d3.tree()
          .size([width - 40, height - 50])
          .separation(() => 3)(d3.hierarchy(data));

      return tree;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style>
#linktree {
  position: absolute;
  width: 25%;
  height: 40%;
  /* background-color: rgb(15, 133, 93); */
  top: 1%;
  left: 74%;
}
</style>