const mongoose = require('mongoose');
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId

//TODO: 나는 ref 재작업
const gatewaySchema = new mongoose.Schema({
    name : { type: String, required: true },
    location : { type: String, required: true },
    ip : { type: String, required: true },
    port : { type: Number, required: true },
    user_obids : [{type:ObjectId, ref: 'User', required: true }],
    camera_obids : [{type:ObjectId, ref: 'Camera'}],
    description : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now },
    update_at : { type: String },
    update_ut : { type: String },
});
gatewaySchema.index({ name: 1, ip: 1, port: 1 });

module.exports = mongoose.model('Gateway', gatewaySchema);
