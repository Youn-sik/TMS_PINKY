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

        get_data = await api_v1_person_fcm.find({},{"_id" : false, "name" : true, "mobile" : true, "device_token" : true});
        console.log(get_data);

        res.send(get_data)        
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.get('/:name',async function(req, res) { //해당 이름의 번호와 device_token 리턴
    try {
        console.log("GET: /:name");

        let get_data = {}
        let name = req.params === undefined ? req.name : req.params.name;
        
        get_data = await api_v1_person_fcm.find({"name" : name},{"_id" : false, "name" : true, "mobile" : true, "device_token" : true});
        res.send(get_data);

    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.get('/:name/:mobile',async function(req, res) { //해당 학생 번호의 device_token 리턴
    try {
        console.log("GET: /fcm/:mobile");

        let get_data = {}
        let name = req.params === undefined ? req.name : req.params.name;
        let mobile = req.params === undefined ? req.mobile : req.params.mobile;
        
        get_data = await api_v1_person_fcm.find({"name" : name, "mobile" : mobile},{"_id" : false, "device_token" : true});
        res.send(get_data);

    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.post('/',async function(req, res) { //해당 이름, 번호, device_token 등록
    try {
        console.log("POST: /fcm/");

        let set_data = {}
        let name = ''
        let mobile = ''
        let device_token = ''

        name = req.body.name;
        mobile = req.body.mobile;
        device_token = req.body.device_token;
        set_data = {
            "name" : name,
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

router.put('/:name/:mobile/:device_token',async function(req, res) { //해당 이름, 전화번호, device_tokendml 정보 수정(한번에 한 가지만 수정 가능)
    try {
        console.log("PUT: /fcm/:mobile");

        let name = ''
        let mobile = ''
        let device_token = ''
        
        let update_name = ''
        let update_mobile = ''
        let update_device_token = ''

        name = req.params.name;
        mobile = req.params.mobile;
        device_token = req.params.device_token;
        
        if(req.body === undefined) {
            res.status(400).send({err:"잘못된 형식 입니다."});
        }
        else if(req.body.name !== undefined) {
            update_name = req.body.name;
            const update_data = await api_v1_person_fcm.findOneAndUpdate({"name" : name, "mobile" : mobile, "device_token" : device_token}, {"name" : update_name}, {new: true });
            res.send(update_data)
        }
        else if(req.body.mobile !== undefined) {
            update_mobile = req.body.mobile;
            const update_data = await api_v1_person_fcm.findOneAndUpdate({"name" : name, "mobile" : mobile, "device_token" : device_token}, {"mobile" : update_mobile}, {new: true });
            res.send(update_data)
        }
        else if(req.body.device_token !== undefined) {
            update_device_token = req.body.device_token;
            const update_data = await api_v1_person_fcm.findOneAndUpdate({"name" : name, "mobile" : mobile, "device_token" : device_token}, {"device_token" : update_device_token}, {new: true });
            res.send(update_data)
        }
        else {
            res.status(400).send({err:"잘못된 형식 입니다."});
        }

    } catch (err) {
        console.log(err);
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.delete('/:name/:mobile/:device_token',async function(req, res) { //해당 device_token 모두 삭제 => device_token 은 GET 요청으로 알 수 있음. 번호 삭제 기능 추가하기
    try {
        console.log("DELETE: /fcm/:device_token");

        let name = ''
        let mobile = ''
        let device_token = ''

        name = req.params.name;
        mobile = req.params.mobile;
        device_token = req.params.device_token;

        const delete_data = await api_v1_person_fcm.remove({"name" : name, "mobile" : mobile, "device_token" : device_token});

        res.send(delete_data);

    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

module.exports = router;