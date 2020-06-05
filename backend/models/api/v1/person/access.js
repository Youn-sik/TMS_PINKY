const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_person_access_Schema = new mongoose.Schema({
    avatar_file : String,
    avatar_contraction_data : String,
    avatar_file_checksum : String,
    avatar_temperature : String,
    user_obid : ObjectId,
    type : Number,
    access_time : String,
    statistics_status : String,
    create_at : String,
    create_ut : String,
    update_at : String,
    update_ut : String,

})

module.exports = mongoose.model('api_v1_person_access', api_v1_person_access_Schema)
