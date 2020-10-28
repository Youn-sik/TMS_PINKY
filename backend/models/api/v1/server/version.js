const mongoose = require('mongoose')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_server_version_Schema = new mongoose.Schema({
    user_obid : { type:ObjectId, ref: 'user', required: true },
    edition : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now() },
    update_at : { type: String },
    update_ut : { type: String }
})
mongoose.set('useCreateIndex', true)
api_v1_server_version_Schema.index({ user_obid: 1, edition: 1 });
mongoose.set('useCreateIndex', true)
module.exports = mongoose.model('version', api_v1_server_version_Schema)
