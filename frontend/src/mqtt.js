import Vue from 'vue'
import VueMqtt from 'vue-mqtt'

const option = {
  clientId: "vue-mqtt",
  clean: false,
  keepalive: 60,
  reconnectPeriod: 5000,
  connectTimeout: 15000,
  resubscribe: false,
  useNewUrlParser: true,
  username:'cloud40_core_web',
  password:'masterQ!W@E#R$'
}

Vue.use ( VueMqtt , 'ws://172.16.135.89:8083/mqtt' , option )

export default VueMqtt
