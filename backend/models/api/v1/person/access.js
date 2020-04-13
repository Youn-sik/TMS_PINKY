const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_person_access_Schema = new mongoose.Schema({
    id : String,
    type : Number,
    last_type : Number,
    group_list : String,
    name : String,
    avatar_file : String,
    mobile : String,
    ic_number : String,
    id_number : String,
    job_number : String,
    birthday : String,
    mail : String,
    gender : String,
    prompt : String,
    remark : String,
    position : String,
    location : String,
    company_id : String,
    department_id : String,
    area_code : String,
    entry_time : String,
    reception_user_id : String,
    guest_company : String,
    guest_purpose : String,
    guest_level : String,
    create_at : String,
    update_at : String,
})

module.exports = mongoose.model('api_v1_person_access', api_v1_person_access_Schema)
