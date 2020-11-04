var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v3_device_camera_filelist = require('../../../../models/api/v3/device/camera_filelist')

router.get('/',async function(req, res) {
    try {
        const get_data = await api_v3_device_camera_filelist.find()
        res.send(get_data)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v3_device_camera_filelist.findById(id)
        res.send(get_single_data)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v3_device_camera_filelist(req.body)
        // api_v3_device_gateway.findByIdAndUpdate(add ,{ $addToSet: { user_obids : add._id} }, {new: true }).exec()
        add.save()
        res.send(add)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await api_v3_device_camera_filelist.findByIdAndUpdate(id, update_data, {new: true })
        res.send(update)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v3_device_camera_filelist.findByIdAndRemove(id)
        res.send(delete_data)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

module.exports = router;