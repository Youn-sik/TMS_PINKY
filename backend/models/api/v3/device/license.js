const mongoose = require('mongoose')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul");

const api_v3_device_license_Schema = new mongoose.Schema({
    "c_type" : {type:String},
    "c_mac" : {type:String},
    "c_eth" : {type:String},
    "c_license_key1" : {type:String},
    "c_license_key2" : {type:String},
    "regdate" : {type:String}
})

mongoose.set('useCreateIndex', true)
api_v3_device_license_Schema.index({ gateway_obid: 1, serial_number: 1, status: 1 });
module.exports = mongoose.model('license', api_v3_device_license_Schema)
