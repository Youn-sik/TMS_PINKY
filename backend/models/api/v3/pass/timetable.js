const mongoose = require('mongoose')

const api_v3_pass_timetable = new mongoose.Schema({
    app_key : String,
    sign : String,
    timestamp : String,
    name : String,
    monday_period : String,
    tuesday_period : String,
    wednesday_period  : String,
    thursday_period : String,
    friday_period : String,
    saturday_period : String,
    sunday_period : String,
    holiday_period : String,
    start_timestamp	: String,
    end_timestamp : String,
    special_days : [{
        id : Number,
        data : String,
        remark : String,
        timetable_id : Number,
    }],
    id : Number,
})

module.exports = mongoose.model('api_v3_pass_timetable', api_v3_pass_timetable)