const mongoose = require('mongoose');
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId

const accessSchema = new mongoose.Schema({
    name : { type: String },
    avatar_file : { type: String, required: true },
    avatar_file_url : { type: String, required: true },
    avatar_contraction_data : { type: String, required: true },
    avatar_file_checksum : { type: String },
    avatar_temperature : { type: String, required: true },
    avatar_distance : { type: Number},
    user_obid : { type:ObjectId, ref: 'User' },
    avatar_type : { type : Number },
    access_time : { type: String },
    authority : { type: String },
    stb_sn : { type:String},
    stb_name : { type:String},
    stb_location : { type:String},
    stb_obid : { type:ObjectId, ref:'Camera'},
    statistics_status : { type: String },
    stb_name : { type:String},
    stb_location : { type:String},
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now },
    update_at : { type: String },
    update_ut : { type: String },
    face_detection : { type:String},
    distance : {type : Number}
});
accessSchema.index({ user_obid: 1, statistics_status: 1, avatar_file_checksum: 1 });

module.exports = mongoose.model('accesses', accessSchema);
