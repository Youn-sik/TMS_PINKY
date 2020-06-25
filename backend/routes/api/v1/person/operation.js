var express = require('express');
var router = express.Router();
const boom = require('boom')
const operation = require('../../../../models/api/v1/person/operation')

router.get('/',async function(req, res) {
    try {
        let get_data = await operation.find().populate('id');
        res.send(get_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await operation.findById(id)
        res.send(get_single_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.post('/',function(req, res) {
    try {
        const add = new operation(req)
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
        const update = await operation.findByIdAndUpdate(id, update_data, {new: true })
        res.send(update) 
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await operation.findByIdAndRemove(id)
        res.send(delete_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

module.exports = router;