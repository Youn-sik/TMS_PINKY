var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v2_device_alarm = require('../../../../models/api/v2/device/alarm')

router.get('/',async function(req, res) {
    try {
        const get_data = await api_v2_device_alarm.find()
        return get_data
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v2_device_alarm.findById(id)
        return get_single_data
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v2_device_alarm(req)
        return add.save()
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await api_v2_device_alarm.findByIdAndUpdate(id, update_data, {new: true })
        return update
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v2_device_alarm.findByIdAndRemove(id)
        return delete_data
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

module.exports = router;

//외래키인 resolve
// exports.getapi_v2_device_alarm_depend_on_user = async (req, reply) => {
//     try {
//         const id = req.params === undefined ? req.id : req.params.id
//         const depend_on_data = await api_v2_device_alarm.find({ user_id : id })
//         return depend_on_data
//     }catch (err) {
//         res.status(400).send({err:"잘못된 형식 입니다."})
//     }
// }

// exports.getapi_v2_device_alarm_depend_on_device = async (req, reply) => {
//     try {
//         const id = req.params === undefined ? req.id : req.params.id
//         const depend_on_data = await api_v2_device_alarm.find({ device_id : id })
//         return depend_on_data
//     }catch (err) {
//         res.status(400).send({err:"잘못된 형식 입니다."})
//     }
// }

// exports.getapi_v2_device_alarm_depend_on_trace = async (req, reply) => {
//     try {
//         const id = req.params === undefined ? req.id : req.params.id
//         const depend_on_data = await api_v2_device_alarm.find({ trace_id : id })
//         return depend_on_data
//     }catch (err) {
//         res.status(400).send({err:"잘못된 형식 입니다."})
//     }
// }
