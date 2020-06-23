const mongoose = require('mongoose')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_person_history_Schema = new mongoose.Schema({
    avatar_file : { type: String, required: true },
    avatar_contraction_data : { type: String},
    avatar_file_checksum : { type: String, required: true },
    avatar_file_url : { type: String, required: true },
    name : { type: String },
    action : { type: String},
    type : { type : Number },
    create_at : { type: String},
    create_ut : { type: String},
});
api_v1_person_history_Schema.index({ user_id: 1, name: 1, avatar_file_checksum: 1, type: 1 });
module.exports = mongoose.model('history', api_v1_person_history_Schema)
