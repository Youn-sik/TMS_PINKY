const mongoose = require('mongoose');
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId

const cameraSchema = new mongoose.Schema({
    gateway_obid : { type:ObjectId, ref: 'Gateway', required: true },
    serial_number : { type: String, required: true },
    name : { type: String, required: true },
    protocol : { type: Number, required: true },
    location : { type: String, required: true },
    status : { type: String },
    download_current : { type: Number },
    app_version : { type: String },
    url : { type: String },
    ip : { type: String },
    port : { type: Number },
    description : { type: String },
    groups_obids : [{type:ObjectId, ref: 'Group'}],
    group_count : { type: Number },
    employee_group_obids : [{type:ObjectId, ref: 'Group'}],
    visitor_group_obids : [{type:ObjectId, ref: 'Group'}],
    blacklist_group_obids : [{type:ObjectId, ref: 'Group'}],
    info_update_time : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now },
    update_at : { type: String },
    update_ut : { type: String },
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
    },
});
cameraSchema.index({ gateway_obid: 1, serial_number: 1, status: 1 });

module.exports = mongoose.model('Camera', cameraSchema);
