var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v3_device_statistics_Schema = require('../../../../models/api/v3/device/statistics')

router.get('/',async function(req, res) {
    try {
        const get_data = await api_v3_device_statistics_Schema.find()
        res.send(get_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v3_device_statistics_Schema.findById(id)
        res.send(get_single_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v3_device_statistics_Schema(req.body)
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
        const update = await api_v3_device_statistics_Schema.findByIdAndUpdate(id, update_data, {new: true })
        res.send(update)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v3_device_statistics_Schema.findByIdAndRemove(id)
        res.send(delete_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

module.exports = router;