const mongoose = require('mongoose')
//const ObjectId = mongoose.Schema.Types.ObjectId

const api_v3_device_gateway_Schema = new mongoose.Schema({
    app_key: String,
    sign: String,
    timestamp: String,
    identifier: String,
    name: String,
    location: String,
    ip: String,
    port: Number,
    account: String,
    password: String, 
    id: String,
    description: String,
    direction: Number,
    ldid: String,
    type_id: Number,
    type_name: String,
    update_at: String,
    create_at: String
})

module.exports = mongoose.model('api_v3_device_gateway', api_v3_device_gateway_Schema)
