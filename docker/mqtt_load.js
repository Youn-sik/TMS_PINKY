const fs = require("fs");
const path = require("path");
const mqtt = require('mqtt');

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

const client = mqtt.connect("mqtt://172.16.135.13",{
    clientId: "core-mqtt-demon",
    clean: true,
    keepalive: 60,
    reconnectPeriod: 5000,
    connectTimeout: 15000,
    resubscribe: false,
    rejectUnauthorized: false,
    useNewUrlParser: true,
    ca: TRUSTED_CA_LIST,
});

client.on('error',function (err) {
    console.log(err)
})

module.exports = client;