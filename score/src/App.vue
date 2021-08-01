<template>
  <div id="app">
   <icicle></icicle>
   <linktree></linktree>
   <circlepack></circlepack>
   <radialtree></radialtree>
   <sunburst></sunburst>
   <treemap></treemap>
   <task></task>
  </div>
</template>

<script>

import icicle from './components/Icicle.vue'
import linktree from './components/linktree.vue'
import circlepack from './components/Circlepack.vue'
import radialtree from './components/Radialtree.vue'
import sunburst from './components/Sunburst.vue'
import treemap from './components/Treemap.vue'
import task from './components/task.vue'
export default {
  name: 'App',
  components: {
    icicle,
    linktree,
    circlepack,
    radialtree,
    sunburst,
    treemap,
    task
  }
}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
