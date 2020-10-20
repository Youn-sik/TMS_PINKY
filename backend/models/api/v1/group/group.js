const mongoose = require('mongoose')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const ObjectId = mongoose.Schema.Types.ObjectId
const api_v1_group_group_Schema = new mongoose.Schema({
    rootParent : { type: ObjectId },
    parent : { type: ObjectId },
    children : [{ type : ObjectId }] ,
    name : { type: String, required: true },
    type : { type: Number, required: true },
    company_id : { type: String },
    user_obids : [{type:ObjectId, ref: 'user'}],
    device_obids :[{type:ObjectId, ref: 'camera'}],
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now() },
    update_at : { type: String },
    update_ut : { type: String },
})
api_v1_group_group_Schema.index({ parent: 1, type: 1, rootParent: 1 });
mongoose.set('useCreateIndex', true)
module.exports = mongoose.model('group', api_v1_group_group_Schema)
