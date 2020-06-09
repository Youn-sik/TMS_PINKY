const mongoose = require('mongoose');
const moment = require('moment');

const camerafailSchema = new mongoose.Schema({
    serial_number : { type: String },
    regdate: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') }
});
camerafailSchema.index({ serial_number: 1 });

module.exports = mongoose.model('camera_fail', camerafailSchema);
