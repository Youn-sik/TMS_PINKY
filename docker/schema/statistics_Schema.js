const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

//TODO: 나는 ref 재작업
const statisticsSchema = new mongoose.Schema({
    camera_obid : { type : ObjectId, ref : 'api_v3_device_camera', required: true },
    all_count : { type: Number, required: true },
    employee_count : { type: Number },
    guest_count : { type: Number },
    stranger_count : { type: Number },
    blacklist_count : { type: Number },
    statistics_obids : [{ type : ObjectId, ref : 'api_v1_person_access', required: true }],
    reference_date : { type: String },
});
statisticsSchema.index({ camera_obid: 1, reference_date: 1 });

module.exports = mongoose.model('Statistics', statisticsSchema);
