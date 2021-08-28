<template>
  <div id="Circlepack"></div>
</template>
<script>
import * as d3 from "d3";
import task from "../tool/task";
export default {
  data() {
    return {
      chart_id: 2,
    };
  },
  methods: {
    init() {
      let that = this;
      let data_maps = this.$store.getters.get_data_map;
      let data_ids = this.$store.getters.get_select_data_id;
      let data = data_maps.get(data_ids);
      let endTime;
      //console.log(that.chart_id);
      d3.select("#chart svg").remove();
      let width = document.getElementById("chart").clientWidth;
      let height = document.getElementById("chart").clientHeight;
      let tree = this.treescale(width, height);
      let root = tree(data);
      // console.log(root);
      let svg = d3
        .select("#chart")
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
        .on("click", function (event, d) {
          if (that.select_tasks == null) {
            //that.select_tasks 是computed里面定义的函数 由于return的是一个动态变量 所以可直接使用
            alert("请选择任务");
            that.init();
            return;
          } else if (that.start_state == null) {
            alert("请点击开始");
            that.init();
            return;
          }
          if (that.select_tasks == 1 && d.data.name == that.find_name) {
            endTime = Date.now();
            that.$store.commit("set_end_time", endTime);
            task.task_1(that.chart_id, that.select_tasks);
            return;
          }
          if (that.select_tasks == 2) {
            if (that.depth_state == null) {
              alert("请选择上下层");
              that.init();
              return;
            } else {
              let state = task.task_2(d.depth, d.data.children.length);
              if (state == true) {
                that.init();
              }
            }
          }
        })
        .attr("r", (d) => d.r)
        .attr("stroke", (d) => (d.children ? "black" : "none"))
        .attr("fill", (d) => (d.children ? "skyblue" : "orange"))
        .append("title")
        .text((d) => d.data.name);
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
    //this.init();
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
    find_name() {
      return this.$store.getters.get_find_name;
    },
    start_state() {
      return this.$store.getters.get_start_state;
    },
    select_data_id() {
      return this.$store.getters.get_select_data_id;
    },
    data_map() {
      return this.$store.getters.get_data_map;
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
/* #chart {
  position: absolute;
  width: 25%;
  height: 40%;
  /* background-color:bisque; */
/* top: 42%;
  left: 20%; } */
</style>