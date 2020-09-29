import './assets/css/style.css'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import splitPane from 'vue-splitpane'

Vue.component('split-pane', splitPane)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
