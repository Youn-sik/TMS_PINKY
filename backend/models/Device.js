// External Dependancies
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const deviceSchema = new mongoose.Schema({
    device_id: String,
    serial_number: String,
    location: String,
    user_fkid: ObjectId
})

module.exports = mongoose.model('Device', deviceSchema)
