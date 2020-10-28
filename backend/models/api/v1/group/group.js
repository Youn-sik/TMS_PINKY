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
    authority : { type: String },
    user_obids : [{type:ObjectId, ref: 'user'}],
    device_obids :[{type:ObjectId, ref: 'camera'}],
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now() },
    update_at : { type: String },
    update_ut : { type: String },
})
api_v1_group_group_Schema.index({ parent: 1 });
api_v1_group_group_Schema.index({ rootParent: 1 });
api_v1_group_group_Schema.index({ children: 1 });
api_v1_group_group_Schema.index({ user_obids: 1 });
api_v1_group_group_Schema.index({ type: 1 });
mongoose.set('useCreateIndex', true)
module.exports = mongoose.model('group', api_v1_group_group_Schema)
