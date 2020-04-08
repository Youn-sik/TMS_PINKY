const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const Authorized_accessSchema = new mongoose.Schema({
    user_fkid: ObjectId,
    name: String,
    company: String,
    data: String
})

module.exports = mongoose.model('Authorized_access', Authorized_accessSchema)
