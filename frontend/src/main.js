import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { createProvider } from './vue-apollo'
import vuetify from './plugins/vuetify';
import VueGoogleCharts from 'vue-google-charts';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import i18n from './i18n'
import mqtt from './mqtt';

Vue.config.productionTip = false
Vue.use(VueGoogleCharts)
new Vue({
  router,
  mqtt,
  apolloProvider: createProvider(),
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
