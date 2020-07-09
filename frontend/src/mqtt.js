import Vue from 'vue'
import VueMqtt from 'vue-mqtt'

const option = {
  clientId: "mqtt_front",
  clean: false,
  keepalive: 60,
  reconnectPeriod: 5000,
  connectTimeout: 15000,
  protocol: 'mqtt',
  resubscribe: false,
  useNewUrlParser: true,
}

Vue.use ( VueMqtt , 'ws://172.16.135.89:8083/mqtt' , option )

export default VueMqtt
