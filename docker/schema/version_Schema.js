const mongoose = require('mongoose');
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId

const versionSchema = new mongoose.Schema({
    user_obid : { type:ObjectId, ref: 'User', required: true },
    edition : { type: String },
    create_at : { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
    create_ut : { type: String, default: Date.now },
    update_at : { type: String },
    update_ut : { type: String }
});
versionSchema.index({ user_obid: 1, edition: 1 });

module.exports = mongoose.model('Version', versionSchema);
