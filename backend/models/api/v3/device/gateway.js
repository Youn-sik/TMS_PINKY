const mongoose = require('mongoose')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v3_device_gateway_Schema = new mongoose.Schema({
    name : { type: String, required: true },
    location : { type: String, required: true },
    ip : { type: String, required: true },
    port : { type: Number, required: true },
    user_obids: [{type:ObjectId, ref: 'user', required: true}],
    camera_obids: [{type:ObjectId, ref: 'camera'}],
    description : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now() },
    update_at : { type: String },
    update_ut : { type: String },
    
})
mongoose.set('useCreateIndex', true)
api_v3_device_gateway_Schema.index({ name: 1, ip: 1, port: 1 });
module.exports = mongoose.model('gateway', api_v3_device_gateway_Schema)
