const mongoose = require('mongoose');
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_person_user_Schema = new mongoose.Schema({
    avatar_file : { type: String },
    avatar_contraction_data : { type: String},
    avatar_file_checksum : { type: String, required: true },
    avatar_file_url : { type: String, required: true },
    groups_obids : [{type:ObjectId, ref: 'group'}],
    user_id : { type: String },
    position : { type: String},
    password : { type: String },
    mobile : { type: String },
    name : { type: String },
    company_id : { type: String },
    department_id : { type: String },
    area_code : { type: String },
    access_time : { type: String },
    mail : { type: String },
    location : { type: String },
    reception_user_obid : { type:ObjectId, ref: 'user' },
    guest_company : { type: String },
    guest_purpose : { type: String },
    count : { type : Number, default: 0},
    gender : { type : Number },
    prompt : { type: String },
    type : { type : Number },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now()},
    update_at : { type: String },
    update_ut : { type: String },
    face_detection : {type: String}
});
api_v1_person_user_Schema.index({ user_id: 1, name: 1, avatar_file_checksum: 1, type: 1 });

module.exports = mongoose.model('user', api_v1_person_user_Schema);
