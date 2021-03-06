const mongoose = require('mongoose')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_person_access_Schema = new mongoose.Schema({
    name : { type: String },
    avatar_file : { type: String, required: true },
    avatar_file_url : { type: String, required: true },
    avatar_contraction_data : { type: String, required: true },
    avatar_file_checksum : { type: String },
    avatar_temperature : { type: String, required: true },
    avatar_distance : { type: Number},
    user_obid : { type:ObjectId, ref: 'User' },
    avatar_type : { type : Number },
    authority : { type: String },
    stb_sn : { type:String},
    stb_name : { type:String},
    stb_location : { type:String},
    stb_obid : { type:ObjectId, ref:'camera'},
    age : {type: Number},
    gender : {type : String},
    access_time : { type: String },
    statistics_status : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now() },
    update_at : { type: String },
    update_ut : { type: String },
    distance : {type : Number}
})
api_v1_person_access_Schema.index({access_time: 1});
api_v1_person_access_Schema.index({avatar_distance: 1});
api_v1_person_access_Schema.index({avatar_temperature: 1});
api_v1_person_access_Schema.index({avatar_type: 1});
api_v1_person_access_Schema.index({stb_sn: 1});
mongoose.set('useCreateIndex', true)
module.exports = mongoose.model('access', api_v1_person_access_Schema)
