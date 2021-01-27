const fs = require("fs");
const path = require("path");
const mqtt = require('mqtt');
const site_info_json = fs.readFileSync(path.join(__dirname, "./cloud40.json"));
const site = JSON.parse(site_info_json);
const TRUSTED_CA_LIST = fs.readFileSync('/etc/emqx/certs/my_root_ca.pem')

// const client = mqtt.connect("wss://localhost:8084/mqtt",{
//     clientId: "core-mqtt-demon",
//     clean: true,
//     keepalive: 60,
//     // key: KEY,
//     // cert: CERT,
//     username: 'admin_server',
//     password:"masterQ!W@E#R$",
//     reconnectPeriod: 5000,
//     connectTimeout: 15000,
//     resubscribe: false,
//     useNewUrlParser: true,
//     rejectUnauthorized: false,
//     // ca: TRUSTED_CA_LIST,
// });

const client = mqtt.connect("mqtts://172.16.135.13",{
    clientId: "core-mqtt-demon",
    clean: true,
    keepalive: 60,
    reconnectPeriod: 5000,
    connectTimeout: 15000,
    username: 'admin_server',
    password:"masterQ!W@E#R$",
    resubscribe: false,
    rejectUnauthorized: false,
    useNewUrlParser: true,
    ca: TRUSTED_CA_LIST,
});

client.on('error',function (err) {
    console.log(err)
})

module.exports = client;