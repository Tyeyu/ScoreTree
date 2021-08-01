<template>
  <div id="icicle"></div>
</template>
<script>
import * as d3 from "d3";
import data from "../../public/static/data.json";
export default {
  methods: {
    init() {
      let width = document.getElementById("icicle").clientWidth;
      let height = document.getElementById("icicle").clientHeight;

      let color = d3.scaleOrdinal(
        d3.quantize(d3.interpolateRainbow, data.children.length + 1)
      );
      let treescale = this.treescale(height,width);
      let root = treescale(data);
      let svg = d3
        .select("#icicle")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      const cell = svg
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", (d) => `translate(${d.y0},${d.x0})`);

      cell
        .append("rect")
        .attr("width", (d) => d.y1 - d.y0)
        .attr("height", (d) => d.x1 - d.x0)
        .attr("fill-opacity", 0.6)
        .attr("fill", (d) => {
          if (!d.depth) return "#ccc";
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        });
    },
    treescale(height, width) {
      let partition = (data) =>
        d3.partition().size([height, width]).padding(1)(
          d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value)
        );
      return partition;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style>
#icicle {
  position: absolute;
  width: 25%;
  height: 40%;
  /* background-color:aquamarine; */
  top: 1%;
  left: 47%;
}
</style>