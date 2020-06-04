const mongoose = require('mongoose')
//const ObjectId = mongoose.Schema.Types.ObjectId

const api_v3_device_record_Schema = new mongoose.Schema({
    start_record_id :String,
    end_record_id   :String,
    device_sn       :String,
    type		:Number,
    user_id	    :String,
    date_time_from  :String,
    date_time_to    :String,
    name	    :String,
    page		:Number,
    size		:Number,
    entry_mode	:Number,
    group_id    :String,
    mis_type	:Number,
    abnormal_types	:Number,
    user_count	:Number,
    guest_count	:Number,
    stranger_count	:Number,
    record_list	:[{
        id		:Number,
        direction	:Number,
        location    :String,
        mobile	    :String,
        remark	    :String,
        groups		:[{
            id	    :String,
            name	    :String,
            type		:Number
        }],
        capture_picture :String,
        capture_bg_picture  :String,
        avatar	    :String,
        user_id		:Number,
        user_name   :String,
        user_type	:Number,
        group_id	:Number,
        group_name  :String,
        device_name :String,
        device_ldid :String,
        sign_time   :String,
        entry_mode	:Number,
        sign_time_zone  :String,
        verify_score	:Number,
        mis_id		:Number,
        mis_type	:Number,
        doc_photo   :String,
        ic_number   :String,
        id_number   :String,
        abnormal_type	:Number,
        job_number  :String,
        user_ic_number  :String,
        user_id_number  :String,
        reception_user_id   :String,
        reception_user_name :String,
        user_remark :String,
        sign_date   :String,
        body_temperature :Number
    }], 
})

module.exports = mongoose.model('api_v3_device_record_Schema', api_v3_device_record_Schema)