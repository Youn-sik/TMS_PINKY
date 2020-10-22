const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const statisticsTempSchema = new mongoose.Schema({
    camera_obid : { type : ObjectId, ref : 'Camera', required: true },
    serial_number : { type : String },
    access_date : { type : String },
    00 : { type: String,default : "0/0/0/0" },
    01 : { type: String,default : "0/0/0/0" },
    02 : { type: String,default : "0/0/0/0" },
    03 : { type: String,default : "0/0/0/0" },
    04 : { type: String,default : "0/0/0/0" },
    05 : { type: String,default : "0/0/0/0" },
    06 : { type: String,default : "0/0/0/0" },
    07 : { type: String,default : "0/0/0/0" },
    08 : { type: String,default : "0/0/0/0" },
    09 : { type: String,default : "0/0/0/0" },
    10 : { type: String,default : "0/0/0/0" },
    11 : { type: String,default : "0/0/0/0" },
    12 : { type: String,default : "0/0/0/0" },
    13 : { type: String,default : "0/0/0/0" },
    14 : { type: String,default : "0/0/0/0" },
    15 : { type: String,default : "0/0/0/0" },
    16 : { type: String,default : "0/0/0/0" },
    17 : { type: String,default : "0/0/0/0" },
    18 : { type: String,default : "0/0/0/0" },
    19 : { type: String,default : "0/0/0/0" },
    20 : { type: String,default : "0/0/0/0" },
    21 : { type: String,default : "0/0/0/0" },
    22 : { type: String,default : "0/0/0/0" },
    23 : { type: String,default : "0/0/0/0" },
});

mongoose.set('useCreateIndex', true)
statisticsTempSchema.index({ camera_obid: 1, reference_date: 1 });
module.exports = mongoose.model('statistics_temps', statisticsTempSchema)
