const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v3_device_camera_Schema = new mongoose.Schema({
    app_key: String,
    sign: String,
    timestamp: String,
    channel: Number,
    identifier: String,
    node_type: Number,
    gateway_id: ObjectId,
    protocol: Number,
    camera_name: String,
    location: String,
    snap_mode: Number,
    status: String,
    software_version: String,
    ip: String,
    port: Number,
    account: String,
    password: String,
    server_id: String,
    camera_id: String,
    id: String,
    name: String,
    description: String,
    direction: Number,
    groups: String,
    group_count: Number,
    employee_group : String,
    visitor_group : String,
    blacklist_group : String,
    ldid: String,
    type_id: Number,
    type_name: String,
    update_at: String,
    create_at: String,
    last_offline_time: String,
    config_data: String
})

module.exports = mongoose.model('api_v3_device_camera', api_v3_device_camera_Schema)
