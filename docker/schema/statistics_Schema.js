const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const statisticsSchema = new mongoose.Schema({
    camera_obid : { type : ObjectId, ref : 'Camera', required: true },
    all_count : { type: Number, required: true },
    employee_count : { type: Number },
    guest_count : { type: Number },
    stranger_count : { type: Number },
    blacklist_count : { type: Number },
    statistics_obids : [{ type : ObjectId, ref : 'Access', required: true }],
    reference_date : { type: String },
});
statisticsSchema.index({ camera_obid: 1, reference_date: 1 });

module.exports = mongoose.model('Statistics', statisticsSchema);
