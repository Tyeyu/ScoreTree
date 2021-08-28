<template>
  <div id="tasks" v-if="isShows === 3">
    <h1>寻找与当前结构相似的结构</h1>
    <br />
    <h1>(范围为当前这一层的上下两层)</h1>
    <button id="start">开始</button>
    <p id>当前层数</p>
    <p id="p1">xxx</p>
    <input type="text" id="in" />
    <button id="sub">提交</button>
    <div id="task_chart"></div>
  </div>
</template>
<script>
import * as d3 from "d3";
import task from "../tool/task";
export default {
  data() {
    return {
      isShows: 0,
      tasks_id: 3,
      start_time: 0,
    };
  },
  methods: {
    init() {
      let that = this;
      let data_maps = this.$store.getters.get_data_map;
      let data_ids = this.$store.getters.get_select_data_id;
      let data = data_maps.get(data_ids);
      let starts = document.getElementById("start");
      let p1 = document.getElementById("p1");
      let tree = this.treescale(800, 800);
      const root = tree(data);
      let node = root.descendants();
      //console.log(node);
      let rad = Math.floor(Math.random() * node.length);
      while (node[rad].data.children.length == 0) {
        rad = Math.floor(Math.random() * node.length);
      }
      let now_node = node[rad];
      //console.log("now_node:", now_node);
      let now_depth = node[rad].depth + 1;
      //console.log("now_depth:", now_depth);

      d3.select("#task_chart svg").remove();
      let total = 0;
      root.each((d) => {
        if (
          (d.data.children.length == node[rad].data.children.length ||
            d.data.children.length == node[rad].data.children.length + 1 ||
            d.data.children.length == node[rad].data.children.length - 1) &&
          (d.depth == node[rad].depth ||
            d.depth == node[rad].depth + 1 ||
            d.depth == node[rad].depth - 1)
        ) {
          // console.log(d);
          total++;
        }
      });
      total = total - 1;
      //console.log("total", total);
      starts.addEventListener("click", function (item) {
        if (that.select_chart == null) {
          alert("请选择视图");
          return;
        }
        that.task_tree(node[rad].data.children.length);
        p1.innerHTML = now_depth;
        that.start_time = Date.now();
        that.$store.commit("set_start_time", that.start_time);
        that.$store.commit("set_start_state", 1);
        d3.selectAll(".dropdown")
          .style("pointer-events", "none")
          .style("cursor", "default");
      });

      let subm = document.getElementById("sub");
      subm.addEventListener("click", function (item) {
        if (that.select_chart == null) {
          alert("请选择视图");
          return;
        } else if (that.start_state == null) {
          alert("请点击开始");
          return;
        }
        let s = document.getElementById("in");
        //console.log(s);
        if (s.value == total) {
          let endTime = Date.now();
          that.$store.commit("set_end_time", endTime);
          task.task_1(that.select_chart, that.tasks_id);
          s.value = " ";
          p1.innerHTML = "xxx";
          return;
        }
        if (s.value != total) {
          alert("答案错误");
          task.task_0(that.select_chart, that.tasks_id);
        }
      });
    },

    task_tree(number) {
      let that = this;
      let data = this.creat_children_Tree(number);
      d3.select("#task_chart svg").remove();
      let width = document.getElementById("task_chart").clientWidth;
      let height = document.getElementById("task_chart").clientHeight;
      let tree = this.treescale(width, height);
      let svg = d3
        .select("#task_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      let root = tree(data);
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
      g.append("g")
        // .attr("transform", "translate(" + 20 + "," + 10 + ")") //点的位置
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
            .y((d) => d.y)
        );
      let nodes = root.descendants();
      const node = g
        .append("g")
        // .attr("transform", "translate(" + 20 + "," + 10 + ")")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll("g")
        .data(nodes)
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
    creat_children_Tree: function (n) {
      let root = {
        name: "test",
        children: [],
        value: n,
      };
      for (let i = 0; i < n; i++) {
        let c = {
          name: "c" + i,
          children: [],
          value: 1,
        };
        root.children.push(c);
      }
      return root;
    },
    treescale: function (width, height) {
      let tree = (data) =>
        d3
          .tree()
          .size([width - 40, height - 150])
          .separation(() => 3)(d3.hierarchy(data));
      return tree;
    },
  },
  computed: {
    select_tasks() {
      return this.$store.getters.get_select_tasks;
    },
    select_chart() {
      return this.$store.getters.get_select_chart;
    },
    start_state() {
      return this.$store.getters.get_start_state;
    },
    isShow() {
      return this.$store.getters.get_isShow;
    },
    select_data_id() {
      return this.$store.getters.get_select_data_id;
    },
    finish_state() {
      return this.$store.getters.get_finish_state;
    },
  },
  watch: {
    select_tasks(id) {
      if (id == this.tasks_id) {
        this.init();
        // this.task_tree();
      }
    },
    isShow(num) {
      this.isShows = num;
    },
    select_data_id(ids) {
      if (this.select_tasks == this.tasks_id) {
        this.init();
      }
    },
    finish_state() {
      this.$store.commit("set_finish_state", null);
    },
  },
};
</script>