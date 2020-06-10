const mongoose = require('mongoose')
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_person_access_Schema = new mongoose.Schema({
    avatar_file : { type: String, required: true },
    avatar_contraction_data : { type: String, required: true },
    avatar_file_checksum : { type: String, required: true },
    avatar_temperature : { type: String, required: true },
    avatar_file_url : { type: String, required: true },
    user_obid : { type:ObjectId, ref: 'user' },
    type : { type : Number },
    access_time : { type: String },
    statistics_status : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now },
    update_at : { type: String },
    update_ut : { type: String },
})

module.exports = mongoose.model('access', api_v1_person_access_Schema)
