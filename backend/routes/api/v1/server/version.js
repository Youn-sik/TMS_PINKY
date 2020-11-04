var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_server_version = require('../../../../models/api/v1/server/version')

router.get('/',async function(req, res) {
    try {
        const get_data = await api_v1_server_version.find()
        res.send(get_data)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_server_version.findById(id)
        res.send(get_single_data)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v1_server_version(req.body)
        res.send(add.save())
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await api_v1_server_version.findByIdAndUpdate(id, update_data, {new: true })
        res.send(update)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_server_version.findByIdAndRemove(id)
        res.send(delete_data)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

//외래키인 resolve
// exports.getapi_v1_person_access_depend_on_user = async (req, reply) => {
//     try {
//         const id = req.params === undefined ? req.id : req.params.id
//         const depend_on_data = await api_v1_person_access.find({ reception_user_id : id })
//         return depend_on_data
//     }catch (err) {
//         res.status(400).send({err:"잘못된 형식 입니다."})
//     }
// }
 
module.exports = router;