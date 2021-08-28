<template>
  <div id="tasks" v-if="isShows === 2">
    <h1>从图中找出对应的名字</h1>
    <div id="starts"><button id="start">开始</button></div>
    <p>当前层数</p>
    <p id="p1">xxx</p>
  <button id="up">向上一层</button> 
    <button id="down">向下一层</button>
    <p id="p2">xxx</p>
    <p>如果找到请用鼠标点击当前结点</p>
  </div>
</template>
<script>
import task from "../tool/task";
import * as d3 from "d3";
export default {
  data() {
    return {
      isShows: 0,
      tasks_id: 2,
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
      let p2 = document.getElementById("p2");
      let tree = this.treescale(800, 800);
      const root = tree(data);
      //console.log(root.height);
      let h = root.height;
      let node = root.descendants();
      //console.log(node.length);
     
      let rad = Math.floor(Math.random() * h);
      //console.log("rad:", rad);
      while (rad == 0 || rad == root.height) {
        rad = Math.floor(Math.random() * root.height);
      }
      this.$store.commit("set_depth",rad);
      let depmap=new Map();
      for(let i=0;i<node.length;i++){
        if(depmap.get(node[i].depth)==undefined){
          depmap.set(node[i].depth,[node[i]])
        }else{
          depmap.get(node[i].depth).push(node[i])
        }
      }
      //console.log(depmap);
      //console.log("map:",depmap.size);
      let max =0;
      //console.log(depmap.get(1)[0].data.children.length);
      for(let i =0;i<depmap.get(rad).length;i++){//当前这一层
          if(depmap.get(rad)[i].data.children.length >depmap.get(rad)[max].data.children.length) max =i;
      }
      let num_rad =  depmap.get(rad)[max].data.children.length;
      let maxs =0;
      let num_up=0;//
      //上层
      if(rad-1>=0){
       for(let i =0;i<depmap.get(rad-1).length;i++){
          if(depmap.get(rad-1)[i].data.children.length >depmap.get(rad-1)[maxs].data.children.length) maxs =i;
        }
        num_up =  depmap.get(rad-1)[maxs].data.children.length;
      }
      //下层
      let dmax=0;
      let num_down=0;
      if(rad+1<depmap.size){
        for(let i =0;i<depmap.get(rad+1).length;i++){
          if(depmap.get(rad+1)[i].data.children.length >depmap.get(rad+1)[dmax].data.children.length) dmax =i;
        } 
        num_down = depmap.get(rad+1)[dmax].data.children.length;
      }
      // console.log(depmap.get(rad));
      // console.log(depmap.get(rad)[max].data.children.length);



      starts.addEventListener("click", function (item) {
        if (that.select_chart == null) {
          alert("请选择视图");
          that.init();
          return;
        }
        p1.innerHTML = rad +1;
        that.$store.commit("set_start_state", 1);
        d3.selectAll(".dropdown")
          .style("pointer-events", "none")
          .style("cursor", "default");
        d3.selectAll("#starts")
          .style("pointer-events", "none")
          .style("cursor", "default");
      });


      let up = document.getElementById("up");
      up.addEventListener("click",function(item){
        if (that.select_chart == null) {
          alert("请选择视图");
          that.init();
          return;
        }
        else if(that.$store.getters.get_start_state !=1){
          alert("请按开始");
          that.init();
          return;
        }
        if(rad-1<0){
          alert("上层未定义");
          d3.selectAll("#up")
          .style("pointer-events", "none")
          .style("cursor", "default");
        }
        else{
        p2.innerHTML =rad;
        let max_num = num_rad>num_up? num_rad:num_up;
        that.$store.commit("set_max_length",max_num);
        that.$store.commit("set_depth_state",0);
        let s = new Date();
        that.$store.commit("set_start_time",s);
         d3.selectAll("#tasks")
          .style("pointer-events", "none")
          .style("cursor", "default");
        } 
      });
      
      let downs = document.getElementById("down");
      downs.addEventListener("click",function(item){
        if (that.select_chart == null) {
          alert("请选择视图");
          that.init();
          return;
        }
        else if(that.$store.getters.get_start_state !=1){
          alert("请按开始");
          that.init();
          return;
        }
        if(rad+2 >= depmap.size){
          alert("下层未定义");
          d3.selectAll("#down")
          .style("pointer-events", "none")
          .style("cursor", "default");
        }
        else{
        p2.innerHTML = rad+2;
        let max_num = num_rad>num_down? num_rad:num_down;
        that.$store.commit("set_max_length",max_num);
        that.$store.commit("set_depth_state",1);
        let s = new Date();
        that.$store.commit("set_start_time",s);
         d3.selectAll("#tasks")
          .style("pointer-events", "none")
          .style("cursor", "default");
        } 
      });
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
    find_name() {
      return this.$store.getters.get_find_name;
    },
    select_data_id() {
      return this.$store.getters.get_select_data_id;
    },
  },
  watch: {
    select_tasks(id) {
      if (id == this.tasks_id) {
        this.init();
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
  },
};
</script>