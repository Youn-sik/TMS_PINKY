const mongoose = require('mongoose');
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId

const fcmSchema = new mongoose.Schema({
    device_token : { type: String},
    mobile : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now },
    update_at : { type: String },
    update_ut : { type: String }
});

module.exports = mongoose.model('fcms', fcmSchema);
