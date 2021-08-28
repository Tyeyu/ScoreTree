<template>
  <div></div>
</template>
<script>
import * as d3 from "d3";
//  import data from "../../public/static/data.json";
import task from "../tool/task";
export default {
  data() {
    return {
      chart_id: 4,
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
      let svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      var colorArray = [d3.schemeCategory10, d3.schemeAccent];
      var colorScheme = d3.scaleOrdinal(colorArray[0]);
      let tree = this.TreeScale(width, height);
      let tdata = this.TreeNode(data);
      const root = tree(tdata);
      let links = root.links();
      svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.7)
        .attr("stroke-width", 1.7)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("x", function (d) {
          // console.log(d)
        })
        .attr(
          "d",
          d3
            .linkRadial()
            .angle((d) => d.x)
            .radius((d) => d.y)
        );
      let nodes = root.descendants();
      svg
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr(
          "transform",
          (d) => `
          rotate(${(d.x * 180) / Math.PI - 90})
          translate(${d.y},0)`
        )
        .attr("name", function (d) {
          return d.data.name;
        })
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
        .attr("fill", (d) => (d.children ? "orange" : "skyblue"))
        .attr("r", 5.5) //圆的大小
        .append("title")
        .text((d) => d.data.name);
    },
    TreeScale: function (width, height) {
      const radius = width > height ? height / 1.7 : width / 1.7;
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
/* #Radialtree {
  position: absolute;
  width: 65%;
  height: 40%;
  top: 42%;
  left: 74%;
} */
</style>