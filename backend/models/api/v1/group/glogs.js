const mongoose = require('mongoose');
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 

const api_v1_group_glogs_Schema = new mongoose.Schema({
    process_status: { type: String, default: "N" },
    stb_id: { type: String },
    stb_sn: { type: String },
    log_no: { type: Number },
    log_message: { type: String },
    create_dt: { type: String },
    regdate: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') }
});
api_v1_group_glogs_Schema.index({ process_status: 1, stb_sn: 1, log_no: 1 });
mongoose.set('useCreateIndex', true)
module.exports = mongoose.model('g_logs', api_v1_group_glogs_Schema);
