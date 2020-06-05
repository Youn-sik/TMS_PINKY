const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const tree = require('mongoose-tree');
const api_v1_group_group_Schema = new mongoose.Schema({
    parent : ObjectId,
    children : [ObjectId],
    name : String,
    type : Number,
    group_id : String,
    company_id : String,
    user_ids : [{type:ObjectId, ref: 'api_v1_person_user'}],
    device_ids :[{type:ObjectId, ref: 'api_v3_device_camera'}],
    create_at : String,
    create_ut : String,
    update_at : String,
    update_ut : String,
    rootParent : ObjectId,
})


module.exports = mongoose.model('api_v1_group_group', api_v1_group_group_Schema)
