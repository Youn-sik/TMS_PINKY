const mongoose = require('mongoose')
//const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_server_version_Schema = new mongoose.Schema({
    app_key: String,
    sign: String,
    timestamp: String,
    edition: String,
    date: String
})

module.exports = mongoose.model('api_v1_server_version', api_v1_server_version_Schema)
