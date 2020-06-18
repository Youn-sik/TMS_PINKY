var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v3_device_camera_monitor = require('../../../../models/api/v3/device/camera_monitor')

router.get('/',async function(req, res) {
    try {
        let get_data;
        if(req.query.id !== undefined) {
            get_data = await api_v3_device_camera_monitor.find({'camera_obids':req.query.id}).sort('-regdate')
        } else {
            get_data = await api_v3_device_camera_monitor.aggregate([
                {
                    $group: {
                        _id: {"camera_obids":"$camera_obids","serial_number":"$serial_number"},
                        lastDate : {$max:'$regdate'},
                        upload_url : {$last:'$upload_url'},
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        lastDate : -1
                    }   
                }
            ])    
        }
        res.send(get_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v3_device_camera_monitor.findById(id)
        res.send(get_single_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v3_device_camera_monitor(req.body)
        // api_v3_device_gateway.findByIdAndUpdate(add ,{ $addToSet: { user_obids : add._id} }, {new: true }).exec()
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
        const update = await api_v3_device_camera_monitor.findByIdAndUpdate(id, update_data, {new: true })
        res.send(update)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v3_device_camera_monitor.findByIdAndRemove(id)
        res.send(delete_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

module.exports = router;