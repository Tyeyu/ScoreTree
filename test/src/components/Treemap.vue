<template>
  <div></div>
</template>
<script>
import * as d3 from "d3";
import task from "../tool/task";
let Treewidth = 0;
let Treeheight = 0;
export default {
  data() {
    return {
      chart_id: 6,
    };
  },
  methods: {
    init() {
      let that = this;
      let data_maps = this.$store.getters.get_data_map;
      let data_ids = this.$store.getters.get_select_data_id;
      //console.log(data_id);
      let data = data_maps.get(data_ids);
      let endTime;
      d3.select("#chart svg").remove();
      let width = document.getElementById("chart").clientWidth;
      let height = document.getElementById("chart").clientHeight;
      Treewidth = width;
      Treeheight = height;
      const x = d3.scaleLinear().rangeRound([20, width - 10]);
      const y = d3.scaleLinear().rangeRound([40, height]);
      let svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      let treemap = this.treescale(width, height);

      let name = (d) =>
        d
          .ancestors()
          .reverse()
          .map((d) => d.data.name)
          .join("/");
      let format = d3.format(",d");
      let group = svg.append("g").call(render, treemap(data));
      function render(group, root) {
        const node = group
          .selectAll("g")
          .data(root.children.concat(root))
          .join("g");

        node
          .filter((d) => (d === root ? d.parent : d.children))
          .attr("cursor", "pointer")
          .on("click", function (event, d) {
            //  console.log(event,d);
            //  console.log(d);
            //  console.log(d.data.name);
            return d === root ? zoomout(root) : zoomin(d);
          });

        node.append("title").text((d) => `${name(d)}\n${format(d.value)}`);

        node
          .append("rect")
          .on("click", function (event, d) {
            //console.log("parent:",d.parent.data.name);
            //console.log("children:",d.children.data.name);
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
              that.init();
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
          // .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
          .attr("fill", (d) =>
            d === root ? "#fff" : d.children ? "#ccc" : "#ddd"
          )
          .attr("stroke", "#fff");

        // node.append("clipPath")
        //     .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
        //     .append("use")
        //     .attr("xlink:href", d => d.leafUid.href);

        node
          .append("text")
          .attr("clip-path", (d) => d.clipUid)
          .attr("font-weight", (d) => (d === root ? "bold" : null))
          .selectAll("tspan")
          .data((d) =>
            (d === root ? name(d) : d.data.name)
              .split(/(?=[A-Z][^A-Z])/g)
              .concat(format(d.value))
          )
          .join("tspan")
          .attr("x", 3)
          .attr(
            "y",
            (d, i, nodes) =>
              `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
          )
          .attr("fill-opacity", (d, i, nodes) =>
            i === nodes.length - 1 ? 0.7 : null
          )
          .attr("font-weight", (d, i, nodes) =>
            i === nodes.length - 1 ? "normal" : null
          )
          .text((d) => d);

        group.call(position, root);
      }
      function position(group, root) {
        group
          .selectAll("g")
          .attr("transform", (d) =>
            d === root ? `translate(20,0)` : `translate(${x(d.x0)},${y(d.y0)})`
          )
          .select("rect")
          .attr("width", (d) =>
            d === root ? Treewidth - 10 : x(d.x1) - x(d.x0)
          )
          .attr("height", (d) => (d === root ? 30 : y(d.y1) - y(d.y0)));
      }

      // When zooming in, draw the new nodes on top, and fade them in.
      function zoomin(d) {
        const group0 = group.attr("pointer-events", "none");
        const group1 = (group = svg.append("g").call(render, d));

        x.domain([d.x0, d.x1]);
        y.domain([d.y0, d.y1]);

        svg
          .transition()
          .duration(750)
          .call((t) => group0.transition(t).remove().call(position, d.parent))
          .call((t) =>
            group1
              .transition(t)
              .attrTween("opacity", () => d3.interpolate(0, 1))
              .call(position, d)
          );
      }
      function zoomout(d) {
        const group0 = group.attr("pointer-events", "none");
        const group1 = (group = svg.insert("g", "*").call(render, d.parent));

        x.domain([d.parent.x0, d.parent.x1]);
        y.domain([d.parent.y0, d.parent.y1]);

        svg
          .transition()
          .duration(750)
          .call((t) =>
            group0
              .transition(t)
              .remove()
              .attrTween("opacity", () => d3.interpolate(1, 0))
              .call(position, d)
          )
          .call((t) => group1.transition(t).call(position, d.parent));
      }
    },
    treescale: function (width, height) {
      let treemap = (data) =>
        d3.treemap().tile(this.tile)(
          d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value)
        );
      return treemap;
    },
    tile: function (node, x0, y0, x1, y1) {
      d3.treemapBinary(node, 0, 0, Treewidth - 10, Treeheight);
      for (const child of node.children) {
        child.x0 = x0 + (child.x0 / (Treewidth - 10)) * (x1 - x0);
        child.x1 = x0 + (child.x1 / (Treewidth - 10)) * (x1 - x0);
        child.y0 = y0 + (child.y0 / Treeheight) * (y1 - y0);
        child.y1 = y0 + (child.y1 / Treeheight) * (y1 - y0);
      }
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
    task_map() {
      return this.$store.getters.get_tasks_map;
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
    //当数据发生改变时函数才会执行
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
</style>