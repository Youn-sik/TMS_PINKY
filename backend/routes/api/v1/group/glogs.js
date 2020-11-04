var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_group_glogs = require('../../../../models/api/v1/group/glogs')

router.get('/',async function(req, res) {
    try {
        let get_data;
        let date = req.query.date
        if(date) 
            date = date.split('/');
            
        if(req.query.type === 'error') {
            get_data = await api_v1_group_glogs
            .find()
            .or([{log_no:'32'},{log_no:'33'},{log_no:'3'}])
            .gte("regdate",date[0]+" 00:00:00")
            .lte("regdate",date[1]+" 23:59:59");
        } else if(req.query.type === 'limit5errors') {
            get_data = await api_v1_group_glogs.find().or([{log_no:'32'},{log_no:'33'},{log_no:'3'}]).limit(5);
        } else {
            get_data = await api_v1_group_glogs.find().limit(1000);
        }
        res.send(get_data)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_group_glogs.findById(id)
        res.send(get_single_data)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v1_group_glogs(req)
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
        const update = await api_v1_group_glogs.findByIdAndUpdate(id, update_data, {new: true })
        res.send(update) 
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_group_glogs.findByIdAndRemove(id)
        res.send(delete_data)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

module.exports = router;