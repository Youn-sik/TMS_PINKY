var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_person_fcm = require('../../../../models/api/v1/person/fcm')

// var fs = require('fs')
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get('/',async function(req, res) { //리스트 json 리턴
    try {
        console.log("GET: /fcm/");

        let get_data = {}

        get_data = await api_v1_person_fcm.find({},{"_id" : false, "mobile" : true, "device_token" : true});
        console.log(get_data);

        res.send(get_data)        
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.get('/:mobile',async function(req, res) { //해당 번호 device_token 리턴
    try {
        console.log("GET: /fcm/:mobile");

        let get_data = {}
        let mobile = req.params === undefined ? req.mobile : req.params.mobile;
        
        get_data = await api_v1_person_fcm.find({"mobile" : mobile},{"_id" : false, "device_token" : true});
        res.send(get_data);

    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.post('/',async function(req, res) { //해당 번호 device_token 등록 및 추가
    try {
        console.log("POST: /fcm/");

        let set_data = {}
        let mobile = ''
        let device_token = ''

        mobile = req.body.mobile;
        device_token = req.body.device_token;
        set_data = {
            "mobile" : mobile,
            "device_token" : device_token
        }

        let add_data = new api_v1_person_fcm({
            ...set_data
        })
        await add_data.save();

        res.send(add_data);

    } catch (err) {
        console.log(err);
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.put('/:device_token',async function(req, res) { //해당 device_token 수정 => device_token 은 GET 요청으로 알 수 있음. 번호 수정 기능 추가하기
    try {
        console.log("PUT: /fcm/:mobile");

        let device_token = ''
        let update_device_token = ''

        device_token = req.params.device_token;
        update_device_token = req.body.device_token;

        const update_data = await api_v1_person_fcm.findOneAndUpdate({"device_token" : device_token}, {"device_token" : update_device_token}, {new: true })

        res.send(update_data)

    } catch (err) {
        console.log(err);
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.delete('/:device_token',async function(req, res) { //해당 device_token 모두 삭제 => device_token 은 GET 요청으로 알 수 있음. 번호 삭제 기능 추가하기
    try {
        console.log("DELETE: /fcm/:device_token");

        let device_token = ''

        device_token = req.params.device_token;

        const delete_data = await api_v1_person_fcm.remove({"device_token" : device_token});

        res.send(delete_data);

    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

module.exports = router;