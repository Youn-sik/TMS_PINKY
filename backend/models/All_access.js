// External Dependancies
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const All_accessSchema = new mongoose.Schema({
    authorized_access_fkid : ObjectId,
    device_fkid : ObjectId,
    safe_status : String,
    recognized_data : String,
    date : String,
    statistics_process_status : String
})

module.exports = mongoose.model('All_access', All_accessSchema)
