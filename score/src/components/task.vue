<template>
  <div id="task">
    <div>
      Data Select
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    
  </div>
</template>
<script>
export default {
    data() {
      return {
        options: [{
          value: '食物分类数据',
          label: '食物分类数据'
        }, {
          value: '行政分类',
          label: '行政分类'
        }, {
          value: 'flare2',
          label: 'flare2'
        }, {
          value: 'flare',
          label: 'flare'
        }],
        value: 'data1',
       
      }

    },
    methods:{
        
    },
    watch:{
      value:function(dataname){
        this.$store.commit('setdata',dataname)
        console.log(dataname)
      }
    }
};
</script>
<style>
#task {
  width: 25%;
}
</style>