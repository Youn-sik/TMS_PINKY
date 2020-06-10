const mongoose = require('mongoose')
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_server_version_Schema = new mongoose.Schema({
    user_obid : { type:ObjectId, ref: 'user', required: true },
    edition : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now },
    update_at : { type: String },
    update_ut : { type: String }
})

module.exports = mongoose.model('version', api_v1_server_version_Schema)
