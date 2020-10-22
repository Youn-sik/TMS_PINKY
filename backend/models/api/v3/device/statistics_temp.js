const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const statisticsTempSchema = new mongoose.Schema({
    camera_obid : { type : ObjectId, ref : 'Camera', required: true },
    serial_number : { type : String },
    access_date : { type : String },
    00 : { type: String },
    01 : { type: String },
    02 : { type: String },
    03 : { type: String },
    04 : { type: String },
    05 : { type: String },
    06 : { type: String },
    07 : { type: String },
    08 : { type: String },
    09 : { type: String },
    10 : { type: String },
    11 : { type: String },
    12 : { type: String },
    13 : { type: String },
    14 : { type: String },
    15 : { type: String },
    16 : { type: String },
    17 : { type: String },
    18 : { type: String },
    19 : { type: String },
    20 : { type: String },
    21 : { type: String },
    22 : { type: String },
    23 : { type: String },
});

mongoose.set('useCreateIndex', true)
statisticsTempSchema.index({ camera_obid: 1, reference_date: 1 });
module.exports = mongoose.model('statistics_temp', statisticsTempSchema)
