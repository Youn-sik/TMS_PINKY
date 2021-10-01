const mongoose = require('mongoose');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const ObjectId = mongoose.Schema.Types.ObjectId

const api_v1_person_fcm_Schema = new mongoose.Schema({
    fcm_token : { type: String},
    mobile : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now },
    update_at : { type: String },
    update_ut : { type: String }
});
mongoose.set('useCreateIndex', true)
module.exports = mongoose.model('fcm', api_v1_person_fcm_Schema);
