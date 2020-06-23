var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_person_history = require('../../../../models/api/v1/person/history')

router.get('/',async function(req, res) {
    try {
        const get_data = await api_v1_person_history.find().sort('-create_at').select('avatar_file_url name type create_at action');
        res.send(get_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_person_history.findById(id)
        res.send(get_single_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v1_person_history(req)
        add.save()
        re.send(add);
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await api_v1_person_history.findByIdAndUpdate(id, update_data, {new: true })
        res.semd(update)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_person_history.findByIdAndRemove(id)
        res.send(delete_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

module.exports = router;
