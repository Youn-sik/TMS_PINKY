const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const statisticsSchema = new mongoose.Schema({
    camera_obid : { type : ObjectId, ref : 'Camera', required: true },
    all_count : { type: Number, required: true ,default:0},
    employee_count : { type: Number ,default:0},
    guest_count : { type: Number ,default:0},
    stranger_count : { type: Number ,default:0},
    blacklist_count : { type: Number ,default:0},
    statistics_obids : [{type:ObjectId, ref: 'Access', required: true }],
    reference_date : { type: String },
});
statisticsSchema.index({ camera_obid: 1, reference_date: 1 });

module.exports = mongoose.model('Statistics', statisticsSchema);
