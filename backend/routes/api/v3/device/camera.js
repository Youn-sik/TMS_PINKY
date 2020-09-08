var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v3_device_camera = require('../../../../models/api/v3/device/camera')
const Operation = require('../../../../models/api/v1/person/operation')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 

router.get('/',async function(req, res) {
    try {
        let get_data;
        if(req.query.authority === 'admin') {
            get_data = await api_v3_device_camera.find().populate('gateway_obid')
        } else {
            get_data = await api_v3_device_camera.find().populate('gateway_obid')
                .where('authority').equals(req.query.authority);
        }
        res.send(get_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v3_device_camera.findById(id)
        res.send(get_single_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v3_device_camera(req.body)
        // api_v3_device_gateway.findByIdAndUpdate(add ,{ $addToSet: { user_obids : add._id} }, {new: true }).exec()
        const operation = new Operation({
            id:req.body.account,
            action: '단말기 추가',
            date : moment().format('YYYY-MM-DD HH:mm:ss'),
            description : add.serial_number +' 단말기 추가'
        })
        operation.save();
        add.save()
        res.send(add)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await api_v3_device_camera.findByIdAndUpdate(id, update_data, {new: true })
        const operation = new Operation({
            id:req.body.account,
            action: '단말기 수정',
            date : moment().format('YYYY-MM-DD HH:mm:ss'),
            description : update.serial_number +' 단말기 수정'
        })
        operation.save();
        res.send(update)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v3_device_camera.findByIdAndRemove(id)
        const operation = new Operation({
            id:req.body.account,
            action: '단말기 삭제',
            date : moment().format('YYYY-MM-DD HH:mm:ss'),
            description : delete_data.serial_number +' 단말기 삭제'
        })
        operation.save();
        res.send(delete_data) 
    } catch (err) {
        throw boom.boomify(err)
    }
});

module.exports = router;