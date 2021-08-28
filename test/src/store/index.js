import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    select_data:null,
    select_chart:null,//当前选择的chartid
    select_tasks:null,//当前选择的taskid
    tasks_map:new Map(),
    start_time:null,
    start_state:null,
    end_time:null,
    isShow:null,
    find_name:null,
    select_data_id:1,
    data_map:new Map(),
    max_length:null,
    depth:null,
    depth_state:null,
    results:[],
    finish_state:null,
  },
  mutations: {//上传值的函数 方法 this.$store.commit("函数名",上传的值)
    set_data(state,data){
      state.select_data=data
    },
    set_select_chart(state,chart_id){
      //console.log(chart_id)
      state.select_chart=chart_id
    },
    set_select_tasks(state,tasks_id){
      state.select_tasks=tasks_id
    },
    set_result(state,data){
      console.log(data);
      state.results.push(data)
    },
    set_tasks_map(state,data){
      // for(let k of data.keys()){
      //   state.tasks_map.set
      // }
      state.tasks_map.set(data.task_id, data.name)
      // state.tasks_map=data
    },
    set_start_time(state,start_time){
      // console.log(start_time)
      state.start_time=start_time;
    },
    set_start_state(state,start_state){
      state.start_state=start_state
    },
    set_end_time(state,end_time){
      state.end_time = end_time;
    },
    set_isShow(state,isShow){
      state.isShow = isShow;
    },
    set_find_name(state,find_name){
      state.find_name = find_name;
    },
    set_select_data_id(state,id){
      state.select_data_id = id;
    },
    set_data_map(state,d){
      state.data_map.set(d.data_id,d.data);
    },
    set_max_length(state,l){
      state.max_length = l;
    },
    set_depth(state,d){
      state.depth = d;
    },
    set_depth_state(state,d){
      state.depth_state = d;
    },
    set_finish_state(state,d){
      state.finish_state = d;
    }
  },
  actions: {
  },
  getters:{//获取值的函数  that.$store.getters.函数名
    get_data(state){
      return state.select_data;
    },
    get_select_chart(state){
      return state.select_chart;
    },
    get_select_tasks(state){
      return state.select_tasks;
    },
    get_result(state){
      return state.result;
    },
    get_tasks_map(state){
      return state.tasks_map;
    },
    get_start_time(state){
      return state.start_time;
    },
    get_start_state(state){
      return state.start_state
    },
    get_end_time(state){
      return state.end_time;
    },
    get_isShow(state){
      return state.isShow;
    },
    get_find_name(state){
      return state.find_name;
    },
    get_select_data_id(state){
      return state.select_data_id;
    },
    get_data_map(state){
      return state.data_map;
    },
    get_max_length(state){
      return state.max_length;
    },
    get_depth(state){
      return state.depth;
    },
    get_depth_state(state){
      return state.depth_state;
    },
    get_finish_state(state){
      return state.finish_state;
    }
  },
})
