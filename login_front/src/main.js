import Vue from 'vue'
import App from './App.vue'
import router from './router'
import apolloProvider from './apollo-provider'

Vue.config.productionTip = false

new Vue({
  router,
  provide: apolloProvider.provide(),
  render: h => h(App)
}).$mount('#app')
