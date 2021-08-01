<template>
  <div id="radialtree"></div>
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
      let width = document.getElementById("radialtree").clientWidth;
      let height = document.getElementById("radialtree").clientHeight;
      let svg = d3
        .select("#radialtree")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
         var colorArray = [d3.schemeCategory10, d3.schemeAccent];
      var colorScheme = d3.scaleOrdinal(colorArray[0]);
        let tree = this.TreeScale(width,height);
        let tdata=this.TreeNode(data)
        const root = tree(tdata)
        let links=root.links()
        svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .attr(
          "transform",
          "translate(" + (width / 2) + "," + (height / 2) + ")"
        )
        .selectAll("path")
        .data(links)
        .enter()
        .append('path')
        .attr('x',function(d){
          // console.log(d)
        })
        .attr(
          "d",
          d3
            .linkRadial()
            .angle((d) => d.x)
            .radius((d) => d.y)
        );
      let nodes=root.descendants()
      svg
        .append("g")
        .attr(
          "transform",
          "translate(" + (width / 2) + "," + (height / 2) + ")"
        )
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr(
          "transform",
          (d) => `
          rotate(${(d.x * 180) / Math.PI - 90})
          translate(${d.y},0)`
        )
        .attr('name',function(d){
          return d.data.name
        })
        // .attr('fill',function(d){
        //   return colorScheme(d.data.color)
        //   // console.log(d)
        // })
        .attr("fill", (d) => (d.children ? "#555" : "#999"))
        .attr("r", 2.5)
        // .append('title')
        // .text(d=>d.data.name);;
    },
    TreeScale: function (width,height) {
      const radius = width>height? height / 1.7:width/1.7;
      let tree = d3
        .tree()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
      return tree;
    },
    TreeNode: function (data) {
      let Tdata = d3
        .hierarchy(data)
        .sort((a, b) => d3.ascending(a.name, b.name));
      return Tdata;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style>
#radialtree {
  position: absolute;
  width: 25%;
  height: 40%;
  /* background-color: rgb(214, 33, 190); */
  top: 42%;
  left: 74%;
}
</style>