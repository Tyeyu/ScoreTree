<template>
  <div id="tasks"  v-if="isShows === 1">
      <h1>从图中找出对应的名字</h1>
      <button id="start">开始</button>
      <p>名字</p>
      <p id="p1">xxx</p>
  </div>
</template>
<script>
import task from "../tool/task";
import * as d3 from "d3";
export default {
  data() {
    return {
      isShows: 0,
      tasks_id:1,
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
      //console.log(data);
      //console.log(nowChart_id);
      // console.log(root.descendants());
      // console.log(root.descendants()[0].height);
      let node = root.descendants();
      //console.log(node.length);
      // let max = 0;
      // for (let i = 1;i<node.length;i++){
      //   if(node[max].height < node[i].height) max = i;
      // }
      //console.log(node[max].data.name);
      let rad = Math.floor(Math.random() * node.length);
      let find_name = node[rad].data.name; //随机出来的结点名字
      // console.log(node);
      // console.log(rad);
      // console.log(node[rad].data.children.length);
      // let father_name = node[rad].data.name;
      //console.log(find_name);
      // that.tasks_map.set(that.tasks_id, { name: find_name });
      // console.log(that.task_map);
      // console.log(that.task_map.get(that.tasks_id).name);
      let task={
        task_id:that.tasks_id,
        name:find_name,
      }
      that.$store.commit("set_tasks_map", task);//提交结果
      that.$store.commit("set_find_name", task.name);
      // let x = that.$store.getters.get_tasks_map;
      // console.log(x);
      starts.addEventListener("click", function (item) {
        if(that.select_chart == null){
        alert("请选择视图");
        that.init();
        return;
      };
        p1.innerHTML = find_name;
        that.start_time = Date.now();
        that.$store.commit("set_start_time", that.start_time);
        that.$store.commit("set_start_state",1);
        d3.selectAll('.dropdown').style('pointer-events','none').style('cursor','default');
        d3.selectAll('#tasks').style('pointer-events','none').style('cursor','default');
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
    select_chart(){
      return this.$store.getters.get_select_chart;
    },
    start_state(){
      return this.$store.getters.get_start_state;
    },
    isShow(){
      return this.$store.getters.get_isShow;
    },
    find_name(){
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
    isShow(num){
      this.isShows = num;
    },
    select_data_id(ids) {
      if(this.select_tasks == this.tasks_id){
        this.init();
      }
    },
  },
};
</script>