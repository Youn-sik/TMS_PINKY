const mongoose = require('mongoose');
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 

const camerafailSchema = new mongoose.Schema({
    serial_number : { type: String },
    regdate: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') }
});
camerafailSchema.index({ serial_number: 1 });
mongoose.set('useCreateIndex', true)
module.exports = mongoose.model('camera_fail', camerafailSchema);
