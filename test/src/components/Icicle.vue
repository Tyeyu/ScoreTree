<template>
  <div></div>
</template>
<script>
import * as d3 from "d3";
// import data from "../../public/static/data.json";
import task from "../tool/task";
export default {
  data() {
    return {
      chart_id: 1,
    };
  },
  methods: {
    init() {
      d3.select("#chart svg").remove();
      let that = this;
      let data_maps = this.$store.getters.get_data_map;
      let data_ids = this.$store.getters.get_select_data_id;
      let data = data_maps.get(data_ids);
      let endTime;
      let width = document.getElementById("chart").clientWidth;
      let height = document.getElementById("chart").clientHeight;
      let color = d3.scaleOrdinal(
        d3.quantize(d3.interpolateRainbow, data.children.length + 1)
      );
      let treescale = this.treescale(height, width);
      let root = treescale(data);
      let svg = d3
        .select("#chart")
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
        .attr("width", (d) => d.y1 - d.y0)
        .attr("height", (d) => d.x1 - d.x0)
        .attr("fill-opacity", 0.6)
        .attr("fill", (d) => {
          if (!d.depth) return "#ccc";
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        })
        .append("title")
        .text((d) => d.data.name);
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