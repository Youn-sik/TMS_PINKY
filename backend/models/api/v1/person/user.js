const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_person_user_Schema = new mongoose.Schema({
    avatar_file : String,
    avatar_contraction_data : String,
    avatar_file_checksum : String,
    groups : ObjectId,
    user_id : String,
    password : String,
    mobile : String,
    name : String,
    company_id : String,
    department_id : String,
    area_code : String,
    access_time : String,
    mail : String,
    location : String,
    reception_user_obid : ObjectId,
    guest_company : String,
    guest_purpose : String,
    gender : Number,
    prompt : String,
    type : Number,
    create_at : String,
    create_ut : String,
    update_at : String,
    update_ut : String,

})

module.exports = mongoose.model('api_v1_person_user', api_v1_person_user_Schema)
