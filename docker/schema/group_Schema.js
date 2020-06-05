const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

//TODO: group_id 삭제처리 
//TODO: 나는 ref 재작업
const groupSchema = new mongoose.Schema({
    rootParent : { type: ObjectId },
    parent : { type: ObjectId },
    children : [{ type : ObjectId }] ,
    name : { type: String, required: true },
    type : { type: Number, required: true },
    company_id : { type: String },
    user_obids : [{type:ObjectId, ref: 'api_v1_person_user'}],
    device_obids :[{type:ObjectId, ref: 'api_v3_device_camera'}],
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now },
    update_at : { type: String },
    update_ut : { type: String },
});
groupSchema.index({ parent: 1, type: 1, rootParent: 1 });

module.exports = mongoose.model('Group', groupSchema);
