<template>
  <div id="app">
    <chose/>
    <icicle></icicle>
    <circlepack></circlepack>
    <linktree></linktree>
    <radialtree></radialtree>
    <sunburst></sunburst>
    <treemap></treemap>
    <timer/>
    <maxNode/>
    <similar/>
    <same/>
  </div>
</template>

<script>
import Chose from "./components/chose.vue";
import icicle from "./components/Icicle.vue";
import linktree from "./components/linktree.vue";
import circlepack from "./components/Circlepack.vue";
import radialtree from "./components/Radialtree.vue";
import sunburst from "./components/Sunburst.vue";
import treemap from "./components/Treemap.vue";
import timer from "./components/timer.vue";
import maxNode from "./components/maxNode.vue";
import data_1 from "../public/static/data_1.json";
import data_2 from "../public/static/data_2.json";
import same from './components/same.vue';
import Similar from './components/similar.vue';
export default {
  name: "App",
  components: {
    Chose,
    icicle,
    linktree,
    circlepack,
    radialtree,
    sunburst,
    treemap,
    timer,
    maxNode,
    same,
    Similar,
  },
    mounted() {
    let that = this;
    push_data(1, data_1);
    //console.log(data_1);
    push_data(2, data_2);
    //console.log(data_2);
    // push_data(3, data_3);
    function push_data(ids, d) {
      let datas = {
        id: ids,
        data: d,
      };
      that.$store.commit("set_data_map", {
        data_id: datas.id,
        data: datas.data,
      });
    }
  },
};
</script>

<style>
#app {
  position: absolute;
  width: 3000px;
  height: 1450px;
  border-width: 2px;
  border-style: double;
  border-color: rgb(18, 22, 27);
  border-top-style: ridge;
  top: 20px;
  left: 35px;
}
</style>
