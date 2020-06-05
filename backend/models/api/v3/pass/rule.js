const mongoose = require('mongoose')

const api_v3_pass_rule = new mongoose.Schema({
    app_key : String,
    sign : String,
    timestamp : String,
    device_id : String,
    timetable_id : String,
    device_name : String,
    group_id : String,
    group_name : String,
    group_type : Number,
    timetable_name : String,
})

module.exports = mongoose.model('api_v3_pass_rule', api_v3_pass_rule)