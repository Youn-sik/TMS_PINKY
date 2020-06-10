const mongoose = require('mongoose');
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId

const groupSchema = new mongoose.Schema({
    rootParent : { type: ObjectId },
    parent : { type: ObjectId },
    children : [{ type : ObjectId }] ,
    name : { type: String, required: true },
    type : { type: Number, required: true },
    company_id : { type: String },
    user_obids : [{type:ObjectId, ref: 'User'}],
    device_obids :[{type:ObjectId, ref: 'Camera'}],
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now },
    update_at : { type: String },
    update_ut : { type: String },
});
groupSchema.index({ parent: 1, type: 1, rootParent: 1 });

module.exports = mongoose.model('Group', groupSchema);
