var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v3_device_gateway = require('../../../../models/api/v3/device/gateway')

router.get('/',async function(req, res) {
    try {
        const get_data = await api_v3_device_gateway.find()
        return get_data
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v3_device_gateway.findById(id)
        return get_single_data
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v3_device_gateway(req.body)
        return add.save()
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await api_v3_device_gateway.findByIdAndUpdate(id, update_data, {new: true })
        return update
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v3_device_gateway.findByIdAndRemove(id)
        return delete_data
    } catch (err) {
        throw boom.boomify(err)
    }
});

module.exports = router;