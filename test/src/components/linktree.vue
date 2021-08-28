<template>
  <div></div>
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
      let endTime;
      d3.select("#chart svg").remove();
      let width = document.getElementById("chart").clientWidth;
      let height = document.getElementById("chart").clientHeight;
      let tree = this.treescale(width, height);
      let svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      const root = tree(data);
      let x0 = Infinity;
      let x1 = -x0;
      root.each((d) => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      });
      const g = svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 30);

      let links = root.links();
      const link = g
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
          // d3
          //     .linkHorizontal()
          d3
            .linkVertical()
            .x((d) => d.x)
            .y((d) => d.y)
        );
      let nodes = root.descendants();
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
          console.log("d:", d.depth);
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
          .size([width - 40, height - 50])
          .separation(() => 3)(d3.hierarchy(data));

      return tree;
    },
  },
  mounted() {
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
/* #linktree {
  position: absolute;
  width: 25%;
  height: 40%;
  /* background-color: rgb(15, 133, 93); */
/* top: 1%;
  left: 74%; */
/* } */
</style>