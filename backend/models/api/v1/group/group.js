const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const tree = require('mongoose-tree');
const api_v1_group_group_Schema = new mongoose.Schema({
    app_key : Number,
    sign : Number,
    timestamp : String,
    parent : ObjectId,
    children : [ObjectId],
    name : String,
    type : Number,
    group_id : String,
    company_id : String,
    user_ids : [{type: mongoose.Schema.Types.ObjectId, ref: 'api_v1_person_user'}],
    device_ids : [ObjectId],
    is_default : Number,
    create_at : String,
    update_at : String,
    rootParent : ObjectId
})


module.exports = mongoose.model('api_v1_group_group', api_v1_group_group_Schema)
