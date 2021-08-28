<template>
  <div></div>
</template>
<script>
import * as d3 from "d3";
import task from "../tool/task";
import date from "../../public/static/data_2.json";
export default {
  data() {
    return {
      chart_id: -3,
    };
  },
  methods: {
    init() {
    //定义边界
      let that =this
      let data = date
      var margin = {top:90, bttom: 0, left: 10, right: 0};
      //d3.select("#chart svg").remove();
      // let width = 960;
      // let height = 600;
    // let width = document.getElementById("tasks").clientWidth; //clientWidth的实际宽度 clientWidth = width+左右padding
    // let height = document.getElementById("tasks").clientHeight; //clientHeigh的实际高度clientHeigh = height + 上下padding
      var svg = d3
          .select("chart")
          .append("svg")
          .attr("width", width )
          .attr("height", height);


      var g = svg
          .append("g")
          .append("transfom", "translate(" + 20 + "," + 10 + ")");

      // var scale = svg
      //     .append("g")
      //     .attr ("transfom", "translate(" + margin.top + ","+ margin.left +")");

    //创建一个层级布局
      var hierarchyData = d3.hierarchy(data).sum(function(d){
        return d.value;
    });
  
   //创建一个树状图
      var tree = d3
          .tree()
          .size([width - 400, height -200])
          .separation(function(a,b){
              return(a.parent == b.parent ?1 : 2) /a.depth;
          });

  //初始化树状图
      var treeDate = tree(hierarchyData);

  //得到边和节点（已经转换完成的）
      var nodes = treeDate.descendants();
      var links = treeDate.links();

  //创建一个贝塞尔生成曲线生成器
      var generator = d3
          .linkHorizontal()
          .x(function(d){
              return d.y;
          })
          .y(function(d){
              return d.x;
          });

  //绘制边
  
      g.append("g")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .append("d",function(d){
          var start = {x:d.source.x, y: d.source.y};//source 父节点的引用
          var end = {x:d.target.x, y: d.target.y};//target 子节点的引用
          return generator ({source:start, target: end});
      })
      .attr("fill","none")
      .attr("stroke","orange")
      .attr("stroke-width",1);

      //建立用来放在每个节点和对应文字的分组
      var gs=g
          .append("g")
          .selectAll("g")
          .data(nodes)
          .enter()
          .append("g")
          .attr("transform", function(d){
              var cx = d.x;
              var cy = d.y;
              return "translate("+ cy +","+ cx +")";
          });


      //绘制节点和文字
      //绘制节点
        gs.append("circle")
          .attr("r", 6)
          .attr("fill", "white")
          .attr("stroke","skyblue")
          .attr("stroke-width",1)

      //绘制文字
      gs.append("text")
          .attr("x",function(d){
              return d.children? -90 :10;
          })
          .attr("y",-5)
          .attr("dy",10)
          .text(function(d){
              return d.data.name;
          })
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