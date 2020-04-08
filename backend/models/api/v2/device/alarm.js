const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v2_device_alarm_Schema = new mongoose.Schema({
    app_key: String,
    sign: String,
    timestamp: String,
    status: Number,
    level: Number,
    code: Number,
    description: String,
    alarm_time: String,
    alarm_timeL: String,
    release_time: String,
    alarm_photo: String,
    reslove_option: Number,
    user_id: ObjectId,
    device_id: ObjectId,
    trace_id: ObjectId
})

module.exports = mongoose.model('api_v2_device_alarm', api_v2_device_alarm_Schema)
