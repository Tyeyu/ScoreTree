import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selct_data:null
  },
  mutations: {
    setdata(state,data){
      state.selct_data=data
    }
  },
  actions: {
  },
  modules: {
  },
  getters:{
    getdata(state){
      return state.selct_data
    }
  }
})
