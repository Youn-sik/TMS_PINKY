const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v3_device_statistics_Schema = new mongoose.Schema({
    camera_obid : ObjectId,
    all_count : Number,
    employee_count : Number,
    guest_count : Number,
    stranger_count : Number,
    blacklist_count : Number,
    statistics_list : [{type:ObjectId, ref: 'api_v1_person_access'}],
    reference_date : String,

})

module.exports = mongoose.model('api_v3_device_statistics_Schema', api_v3_device_statistics_Schema)
