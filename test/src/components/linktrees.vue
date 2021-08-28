<template>
  <div id = "task_chart"></div>
</template>
<script>
import * as d3 from "d3";
import task from "../tool/task";
export default {
  data() {
    return {
      chart_id: 3,
    };
  },
  methods: {
    init() {
      let that = this;
      let data_maps = this.$store.getters.get_data_map;
      let data_ids = this.$store.getters.get_select_data_id;
      let data = data_maps.get(data_ids);
      d3.select("#task_chart svg").remove();
      let width = document.getElementById("task_chart").clientWidth;
      let height = document.getElementById("task_chart").clientHeight;
      let tree = this.treescale(width, height);
      let svg = d3
        .select("#task_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      const root = tree(data);
      console.log(root);
      let nodes = root.descendants();
      console.log(nodes);
      let x0 = Infinity;
      let x1 = -x0;
      let deal_nodes =[];
      let h=2;
      let i =1;
      deal_nodes[0] =nodes[100];
      root.each((d) => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
         if(d.depth == h&&d.parent.data.name ==deal_nodes[0].data.name){
           deal_nodes[i] = d;
          i++;
        }
      });
      console.log("处理后:",deal_nodes);
      for(let i=1;i<deal_nodes.length;i++){
        deal_nodes[i].children =0;
      }
      // let b = deal_nodes;
      // for(let i=1;i<b.length;i++){
      //   b[i].children =0;
      // }
      //console.log(b);
      const g = svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 30);
      let links = deal_nodes[0].links();
      g
        .append("g")
        .attr("transform", "translate(" + 20 + "," + 10 + ")") //点的位置
        .attr("fill", "none")
        .attr("stroke", "#555")
        //线条的粗细
        .attr("stroke-opacity", 0.7)
        .attr("stroke-width", 1.8)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr(
          "d",
          
          d3
            .linkVertical()
            .x((d) => d.x)
            .y((d) => d.y),
        )
      const node = g
        .append("g")
        .attr("transform", "translate(" + 20 + "," + 10 + ")")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll("g")
        .data(deal_nodes)
        .join("g");
      node
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("fill", (d) => (d.children ? "#555" : "#999"))
        .attr("r", function (d) {
          return 4.5; //点的大小
        })
        .append("title")
        .text((d) => d.data.name);
    },
    treescale: function (width, height) {
      let tree = (data) =>
        d3
          .tree()
          .size([width + 40, height + 50])
          .separation(() => 3)(d3.hierarchy(data));
      return tree;
    },

  },
  mounted() {
    // this.init();
  },
  computed: {
    select_chart() {
      return this.$store.getters.get_select_chart;
    },
    select_tasks() {
      return this.$store.getters.get_select_tasks;
    },
    end_time() {
      return this.$store.getters.get_end_time;
    },
    select_data_id() {
      return this.$store.getters.get_select_data_id;
    },
    data_map() {
      return this.$store.getters.get_data_map;
    },
    start_state() {
      return this.$store.getters.get_start_state;
    },
    find_name() {
      return this.$store.getters.get_find_name;
    },
    max_length() {
      return this.$store.getters.get_max_length;
    },
    depth() {
      return this.$store.getters.get_depth;
    },
    depth_state() {
      return this.$store.getters.get_depth_state;
    },
  },
  watch: {
    select_chart(id) {
      // console.log('fffff')
      if (id == this.chart_id) {
        this.init();
      }
    },
    select_data_id(ids) {
      if (this.select_chart == this.chart_id) {
        this.init();
      }
    },
  },
};
</script>
<style>

</style>