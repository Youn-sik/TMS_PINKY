const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const statisticsSchema = new mongoose.Schema({
    camera_obid : { type : ObjectId, ref : 'Camera', required: true },
    serial_number : { type : String },
    access_date : { type : String },
    all_count : { type: Number ,default:0},
    00 : { type: Number ,default:0},
    01 : { type: Number ,default:0},
    02 : { type: Number ,default:0},
    03 : { type: Number ,default:0},
    04 : { type: Number ,default:0},
    05 : { type: Number ,default:0},
    06 : { type: Number ,default:0},
    07 : { type: Number ,default:0},
    08 : { type: Number ,default:0},
    09 : { type: Number ,default:0},
    10 : { type: Number ,default:0},
    11 : { type: Number ,default:0},
    12 : { type: Number ,default:0},
    13 : { type: Number ,default:0},
    14 : { type: Number ,default:0},
    15 : { type: Number ,default:0},
    16 : { type: Number ,default:0},
    17 : { type: Number ,default:0},
    18 : { type: Number ,default:0},
    19 : { type: Number ,default:0},
    20 : { type: Number ,default:0},
    21 : { type: Number ,default:0},
    22 : { type: Number ,default:0},
    23 : { type: Number ,default:0},
    24 : { type: Number ,default:0},
});

statisticsSchema.index({ camera_obid: 1, reference_date: 1 });

module.exports = mongoose.model('Statistics', statisticsSchema);
