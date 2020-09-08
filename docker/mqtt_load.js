const fs = require("fs");
const path = require("path");
const mqtt = require('mqtt');
const site_info_json = fs.readFileSync(path.join(__dirname, "./cloud40.json"));
const site = JSON.parse(site_info_json);

const client = mqtt.connect({
    clientId: "core-mqtt-demon",
    clean: true,
    keepalive: 60,
    reconnectPeriod: 5000,
    connectTimeout: 15000,
    host: site.mqtt_host,
    port: site.mqtt_port,
    protocol: 'mqtt',
    resubscribe: false,
    useNewUrlParser: true,
});

module.exports = client;