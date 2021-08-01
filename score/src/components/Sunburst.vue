<template>
  <div id="sunburst"></div>
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
      let width = document.getElementById("sunburst").clientWidth;
      let height = document.getElementById("sunburst").clientHeight;
      // console.log(height, width);
      let color = d3.scaleOrdinal(
        d3.quantize(d3.interpolateRainbow, data.children.length + 1)
      );
      let radius = width>height? height / 2:width/2;
      let treescale = this.treescale(radius);
      let root = treescale(data);
      console.log(radius)
      let arc = d3
        .arc()
        .startAngle((d) => d.x0)
        .endAngle((d) => d.x1)
        .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius / 2)
        .innerRadius((d) => d.y0)
        .outerRadius((d) => d.y1 - 1);
      let svg = d3
        .select("#sunburst")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      svg
        .append("g")
        .attr(
          "transform",
          "translate(" + (width / 2) + "," + (height / 2) + ")"
        )
        .attr("fill-opacity", 0.6)
        .selectAll("path")
        .data(root.descendants().filter((d) => d.depth))
        .join("path")
        .attr("fill", (d) => {
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        })
        .attr("d", arc);
    },
    treescale(radius) {
      let partition = (data) =>
        d3.partition().size([2 * Math.PI, radius])(
          d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value)
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
#sunburst {
  position: absolute;
  width: 25%;
  height: 40%;
  /* background-color: rgb(207, 194, 13); */
  top: 42%;
  left: 47%;
}
</style>