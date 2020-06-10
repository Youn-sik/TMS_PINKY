const mongoose = require('mongoose')
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v3_device_gateway_Schema = new mongoose.Schema({
    name : { type: String, required: true },
    location : { type: String, required: true },
    ip : { type: String, required: true },
    port : { type: Number, required: true },
    user_obid: [{type:ObjectId, ref: 'user', required: true}],
    camera_id: [{type:ObjectId, ref: 'camera'}],
    description : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now },
    update_at : { type: String },
    update_ut : { type: String },
    
})

module.exports = mongoose.model('gateway', api_v3_device_gateway_Schema)
