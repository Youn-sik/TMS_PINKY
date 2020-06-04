var express = require('express');
var router = express.Router();
const boom = require('boom')
const User = require('../models/User')

router.get('/',async function(req, res) {
    try {
        const users = await User.find()
        res.send(users)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const user = await User.findById(id)
        res.send(user)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.post('/',async function(req, res) {
    try {
        const add = new User(req.body)
        res.send(add.save())
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await User.findByIdAndUpdate(id, update_data, {new: true })
        res.send(update);
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await User.findByIdAndRemove(id)
        res.send(delete_data);
    } catch (err) {
        throw boom.boomify(err)
    }
});

module.exports = router;