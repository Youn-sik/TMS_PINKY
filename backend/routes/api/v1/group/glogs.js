var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_group_glogs = require('../../../../models/api/v2/device/glogs')

router.get('/',async function(req, res) {
    try {
        let get_data;
        if(req.query.type === 'errer') {
            get_data = await api_v1_group_glogs.find().or([{log_no:'32'},{log_no:'33'},{log_no:'3'}]);
        } else {
            get_data = await api_v1_group_glogs.find();
        }
        return get_data
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_group_glogs.findById(id)
        return get_single_data
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v1_group_glogs(req)
        return add.save()
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await api_v1_group_glogs.findByIdAndUpdate(id, update_data, {new: true })
        return update
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_group_glogs.findByIdAndRemove(id)
        return delete_data
    } catch (err) {
        throw boom.boomify(err)
    }
});

module.exports = router;