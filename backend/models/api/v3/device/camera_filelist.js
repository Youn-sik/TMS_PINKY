const mongoose = require('mongoose');
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const ObjectId = mongoose.Schema.Types.ObjectId

const camerafilelistSchema = new mongoose.Schema({
    camera_obids : { type:ObjectId, ref: 'camera', required: true },
    serial_number : { type: String, required: true },
    file_name : { type: String, required: true },
    file_size : { type: Number, required: true },
    status : { type: String, required: true },
    file_date : { type: String },
    create_dt: { type: String },
    regdate: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
});
camerafilelistSchema.index({ camera_obids: 1, serial_number: 1, status : 1 });

module.exports = mongoose.model('Camera_filelist', camerafilelistSchema);
