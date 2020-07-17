const mongoose = require('mongoose')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_person_access_Schema = new mongoose.Schema({
    avatar_file : { type: String, required: true },
    avatar_file_url : { type: String, required: true },
    avatar_contraction_data : { type: String, required: true },
    avatar_file_checksum : { type: String },
    avatar_temperature : { type: String, required: true },
    user_obid : { type:ObjectId, ref: 'User' },
    avatar_type : { type : Number },
    stb_sn : { type:String},
    stb_obid : { type:ObjectId, ref:'camera'},
    access_time : { type: String },
    statistics_status : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now() },
    update_at : { type: String },
    update_ut : { type: String },
})
api_v1_person_access_Schema.index({ user_obid: 1, statistics_status: 1, avatar_file_checksum: 1 });
module.exports = mongoose.model('access', api_v1_person_access_Schema)
