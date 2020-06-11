const mongoose = require('mongoose');
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId

const cameramonitorSchema = new mongoose.Schema({
    camera_obids : { type:ObjectId, ref: 'camera', required: true },
    serial_number : { type: String, required: true },
    name : { type: String, required: true },
    location : { type: String, required: true },
    sha1_value : { type: String },
    upload_url : { type: String },
    width : { type: String },
    height : { type: String },
    filesize : { type: Number },
    filename : { type: String },
    create_dt: { type: String },
    regdate: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
});
cameramonitorSchema.index({ camera_obids: 1, serial_number: 1 });

module.exports = mongoose.model('Camera_monitor', cameramonitorSchema);
