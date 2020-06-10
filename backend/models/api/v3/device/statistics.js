const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v3_device_statistics_Schema = new mongoose.Schema({
    camera_obid : { type : ObjectId, ref : 'camera', required: true },
    all_count : { type: Number, required: true },
    employee_count : { type: Number },
    guest_count : { type: Number },
    stranger_count : { type: Number },
    blacklist_count : { type: Number },
    statistics_list : [{type:ObjectId, ref: 'access', required: true }],
    reference_date : { type: String },
})

module.exports = mongoose.model('statistics', api_v3_device_statistics_Schema)
