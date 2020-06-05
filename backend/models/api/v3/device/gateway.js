const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v3_device_gateway_Schema = new mongoose.Schema({
    name: String,
    location: String,
    ip: String,
    port: Number,
    user_obid: [{type:ObjectId, ref: 'api_v1_person_user'}],
    camera_id: [{type:ObjectId, ref: 'api_v3_device_camera'}],
    description: String,
    create_at: String,
    create_ut: String,
    update_at: String,
    update_ut: String,
    
})

module.exports = mongoose.model('api_v3_device_gateway', api_v3_device_gateway_Schema)
