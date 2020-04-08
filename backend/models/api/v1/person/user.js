const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_person_user_Schema = new mongoose.Schema({
    app_key: String,
    sign: String,
    timestamp: String,
    avatar_file: String,
    groups: Array,
    ic_number: String,
    job_number: String,
    id_number: String,
    mobile: String,
    name: String,
    remark: String,
    force: Number,
    company_id: String,
    department_id: String,
    area_code: String,
    birthday: String,
    entry_time: String,
    mail: String,
    position: String,
    location: String,
    reception_user_id: ObjectId,
    guest_company: String,
    guest_purpose: String,
    level: String,
    gender: Number,
    prompt: String,
    type: Number,
    last_type: Number,
    created_at: String,
    updated_at: String
})

module.exports = mongoose.model('api_v1_person_user', api_v1_person_user_Schema)
