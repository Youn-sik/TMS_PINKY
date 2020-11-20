var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v3_device_camera = require('../../../../models/api/v3/device/camera')
const Operation = require('../../../../models/api/v1/person/operation')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 

router.get('/',async function(req, res) {
    try {
        let get_data;
        let auth = req.query.authority === 'admin' ? new RegExp('') : new RegExp("^"+req.query.authority+"$")
        if(req.query.authority.split('-').length === 2){
            auth = new RegExp("^"+req.query.authority)
        }

        if(req.query.authority === 'admin') {
            get_data = await api_v3_device_camera.find().populate('gateway_obid').sort('status')
        } else {
            get_data = await api_v3_device_camera.find().populate('gateway_obid').sort('status')
                .where('authority').regex('authority',auth)
        }
        res.send(get_data)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v3_device_camera.findById(id)
        res.send(get_single_data)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.post('/',async function (req, res) {
    try {
        const add = new api_v3_device_camera(req.body)
        // api_v3_device_gateway.findByIdAndUpdate(add ,{ $addToSet: { user_obids : add._id} }, {new: true }).exec()
        const operation = new Operation({
            id:req.body.account,
            action: '단말기 추가',
            date : moment().format('YYYY-MM-DD HH:mm:ss'),
            description : add.serial_number +' 단말기 추가',
            authority : req.body.operation_auth
        })
        operation.save();
        await add.save()
        res.send(add)
    } catch (err) {
        console.log(err);
        // res.status(400).send({err:"잘못된 형식 입니다."})
        res.send({'error':'중복되는 시리얼 넘버'})
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await api_v3_device_camera.findByIdAndUpdate(id, update_data, {new: true })
        const operation = new Operation({
            id:req.body.account,
            action: '단말기 수정',
            date : moment().format('YYYY-MM-DD HH:mm:ss'),
            description : update.serial_number +' 단말기 수정',
            authority : req.body.operation_auth
        })
        operation.save();
        res.send(update)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.delete('/:id',async function(req, res) {
    try {
        if(req.body.devices === undefined) {
            const id = req.params === undefined ? req.id : req.params.id
            const delete_data = await api_v3_device_camera.findByIdAndRemove(id)
            const operation = new Operation({
                id:req.body.account,
                action: '단말기 삭제',
                date : moment().format('YYYY-MM-DD HH:mm:ss'),
                description : delete_data.serial_number +' 단말기 삭제',
                authority : req.body.operation_auth
            })
            operation.save();
            res.send(delete_data) 
        } else {
            let operations = []
            let result = await api_v3_device_camera.deleteMany({ _id: { $in: req.body.list} })
            req.body.devices.map((i) => {
                operations.push(
                    new Operation({
                        id:req.body.account,
                        action: '단말기 삭제',
                        date : moment().format('YYYY-MM-DD HH:mm:ss'),
                        description : i.serial_number +' 단말기 삭제',
                        authority : req.body.operation_auth
                    })
                )
            })
            Operation.insertMany(operations)
            res.send(result);
        }
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

module.exports = router;