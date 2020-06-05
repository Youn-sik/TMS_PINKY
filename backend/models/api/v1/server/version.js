const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_server_version_Schema = new mongoose.Schema({
    user_obid : ObjectId,
    edition : String,
    create_at : String,
    create_ut : String,
    update_at : String,
    update_ut : String,

})

module.exports = mongoose.model('api_v1_server_version', api_v1_server_version_Schema)
