const mongoose = require('mongoose')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const ObjectId = mongoose.Schema.Types.ObjectId

const operrion = new mongoose.Schema({
    id : { type: ObjectId,ref:'account'},
    action : { type: String,},
    date : { type: String },
    description : { type: String},
});
module.exports = mongoose.model('operation', operrion)
