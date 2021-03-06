const mongoose = require('mongoose')
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v3_device_camera_Schema = new mongoose.Schema({
    // gateway_obid : {type:ObjectId, ref: 'gateway', required: false},
    serial_number : { type: String, required: true, unique: true },
    name : { type: String, required: true },
    protocol : { type: Number},
    location : { type: String, required: true },
    status : { type: String },
    // grid : { type: Object},
    lat : {type: String},
    lng : {type: String},
    x : {type: String},
    y : {type: String},
    download_current : { type: Number },
    app_version : { type: String },
    url : { type: String },
    ip : { type: String },
    port : { type: Number },
    authority : { type: String },
    description : { type: String },
    groups_obids : [{type:ObjectId, ref: 'group'}],
    group_count : { type: Number },
    employee_group : [{type:ObjectId, ref: 'group'}],
    visitor_group : [{type:ObjectId, ref: 'group'}],
    blacklist_group : [{type:ObjectId, ref: 'group'}],
    info_update_time : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now() },
    update_at : { type: String },
    update_ut : { type: String },
    door_control : { type: String },
    start_time : { type: String },
    end_time : { type: String },
    door_days : {type:String},
    config_data : {
        device_run_type : { type: Number },
        capture_status : { type: String },
        capture_time : { type: String },
        capture_size : { type: String },
        hdd_total : { type: Number },
        hdd_used : { type: Number },
        mac_address : { type: String },
        voice_broadcast : { type: Boolean },
        fill_light : { type: Boolean },
        welcome_tip : { type: String },
        verify_success_tip : { type: String },
        verify_fault_tip : { type: String },
        show_user_info : { type: String },
        use_show_avatar : { type: Boolean },
        show_user_name : { type: Boolean },
        black_list_tip : { type: String },
        recognition_distance : { type: Number },
        network_relay_address : { type: String },
        language_type : { type: Number },
        auto_reboot : { type: Boolean },
        reboot_time : { type: String },
    }
})
mongoose.set('useCreateIndex', true)
api_v3_device_camera_Schema.index({ gateway_obid: 1, serial_number: 1, status: 1 });
module.exports = mongoose.model('camera', api_v3_device_camera_Schema)
