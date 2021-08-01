<template>
  <div id="circlepack"></div>
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
      let width = document.getElementById("circlepack").clientWidth;
      let height = document.getElementById("circlepack").clientHeight;
      let tree = this.treescale(width, height);
      let root = tree(data);
      // console.log(root);
      let svg = d3
        .select("#circlepack")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      const node = svg
        .append("g")
        .attr("pointer-events", "all")
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      node
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("stroke", (d) => (d.children ? "#bbb" : "none"))
        .attr("fill", (d) => (d.children ? "none" : "#ddd"));
    },
    treescale: function (width, height) {
      let tree = (data) =>
        d3.pack().size([width, height]).padding(3)(
          d3
            .hierarchy(data)
            .sum(function (d) {
              return d.value ? 1 : 0;
            })
            .sort((a, b) => b.value - a.value)
        );
      return tree;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style>
#circlepack {
  position: absolute;
  width: 25%;
  height: 40%;
  /* background-color:bisque; */
  top: 42%;
  left: 20%;
}
</style>