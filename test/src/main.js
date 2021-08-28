import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import ElementUI from 'element-ui';
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
