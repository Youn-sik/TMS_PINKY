var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v3_device_camera = require('../../../../models/api/v3/device/camera')

router.get('/',async function(req, res) {
    try {
        const get_data = await api_v3_device_camera.find().populate('gateway_obid')
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
        console.log(req.body);
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
        res.send(update)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v3_device_camera.findByIdAndRemove(id)
        res.send(delete_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

module.exports = router;

//외래키인 resolve
// exports.getapi_v3_device_camera_depend_on_gateway = async (req, reply) => {
//     try {
//         const id = req.params === undefined ? req.id : req.params.id
//         const depend_on_data = await api_v3_device_camera.find({ gateway_id : id })
//         res.send(depend_on_data)
//     }catch (err) {
//         throw boom.boomify(err)
//     }
// }
