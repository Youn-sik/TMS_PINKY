const client = require('../../../../../docker/mqtt_load');
let id = Math.random().toString(36).substr(2,11);

client.on('connect', () => {
  console.log('isConnected')
  client.subscribe('/user/add/result/+');
});




var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_person_user = require('../../../../models/api/v1/person/user')
const api_v1_group_group = require('../../../../models/api/v1/group/group')
const api_v3_device_camera = require('../../../../models/api/v3/device/camera')
const Access = require('../../../../models/api/v1/person/access')
const History = require('../../../../models/api/v1/person/history')
const Operation = require('../../../../models/api/v1/person/operation')
const resizeImg = require('resize-img');
const crypto = require('crypto');


var fs = require('fs')
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get('/',async function(req, res) {
    try {
        console.log("pinkyApp GET(/)")

        let get_data = {}

        get_data.data = await api_v1_person_user.find({})
        .select('-face_detection')
        get_data.camera = await api_v3_device_camera.find({},{"name" : true, "location" : true, "serial_number" : true, "status" : true, "lat" : true, "lng" : true})
        
        for(let i =0; i<get_data.data.length; i++){
            get_data.data[i].avatar_file_url = get_data.data[i].avatar_file_url.replace('172.16.41.114:3000', '211.204.122.90:10891')
        }
        
        res.send(get_data);
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.get('/:what/:thing',async function(req, res) {
    try {
        console.log("pinkyApp GET(/:what/:thing)")

        let get_data = {}

        if(req.params.what == '_id'){
            const id = req.params === undefined ? req.thing : req.params.thing
            get_data.data = await api_v1_person_user.findById(id)
            get_data.camera = await api_v3_device_camera.find({},{"name" : true, "location" : true, "serial_number" : true, "status" : true, "lat" : true, "lng" : true})
            
            get_data.data.avatar_file_url = get_data.data.avatar_file_url.replace('172.16.41.114:3000', '211.204.122.90:10891')
            
            res.send(get_data)
        } else if(req.params.what == 'gender'){
            const gender_num = req.params === undefined ? req.thing : req.params.thing
            if(gender_num == 1) {
                const gender = 1
                get_data.data = await api_v1_person_user.find({"gender" : gender})
                get_data.camera = await api_v3_device_camera.find({},{"name" : true, "location" : true, "serial_number" : true, "status" : true, "lat" : true, "lng" : true})
                
                for(let i =0; i<get_data.data.length; i++){
                    get_data.data[i].avatar_file_url = get_data.data[i].avatar_file_url.replace('172.16.41.114:3000', '211.204.122.90:10891')
                }
                
                res.send(get_data)
            } else if(gender_num == 0) {
                const gender = 0
                get_data.data = await api_v1_person_user.find({"gender" : gender})
                get_data.camera = await api_v3_device_camera.find({},{"name" : true, "location" : true, "serial_number" : true, "status" : true, "lat" : true, "lng" : true})
                
                for(let i =0; i<get_data.data.length; i++){
                    get_data.data[i].avatar_file_url = get_data.data[i].avatar_file_url.replace('172.16.41.114:3000', '211.204.122.90:10891')
                }
                
                res.send(get_data)
            }
        } else if(req.params.what == 'name'){
            const name = req.params === undefined ? req.thing : req.params.thing
            get_data.data = await api_v1_person_user.find({"name" : name})
            get_data.camera = await api_v3_device_camera.find({},{"name" : true, "location" : true, "serial_number" : true, "status" : true, "lat" : true, "lng" : true})
            
            for(let i =0; i<get_data.data.length; i++){
                get_data.data[i].avatar_file_url = get_data.data[i].avatar_file_url.replace('172.16.41.114:3000', '211.204.122.90:10891')
            }
            
            res.send(get_data)
        } else if(req.params.what == 'user_id'){
            const user_id = req.params === undefined ? req.thing : req.params.thing
            get_data.data = await api_v1_person_user.find({"user_id" : user_id})
            get_data.camera = await api_v3_device_camera.find({},{"name" : true, "location" : true, "serial_number" : true, "status" : true, "lat" : true, "lng" : true})
            
            for(let i =0; i<get_data.data.length; i++){
                get_data.data[i].avatar_file_url = get_data.data[i].avatar_file_url.replace('172.16.41.114:3000', '211.204.122.90:10891')
            }
            
            res.send(get_data)
        } else if(req.params.what == 'location'){
            const location = req.params === undefined ? req.thing : req.params.thing
            get_data.data = await api_v1_person_user.find({"location" : location})
            get_data.camera = await api_v3_device_camera.find({},{"name" : true, "location" : true, "serial_number" : true, "status" : true, "lat" : true, "lng" : true})
            
            for(let i =0; i<get_data.data.length; i++){
                get_data.data[i].avatar_file_url = get_data.data[i].avatar_file_url.replace('172.16.41.114:3000', '211.204.122.90:10891')
            }
            
            res.send(get_data)
        } else if(req.params.what == 'position'){
            const position = req.params === undefined ? req.thing : req.params.thing
            get_data.data = await api_v1_person_user.find({"position" : position})
            get_data.camera = await api_v3_device_camera.find({},{"name" : true, "location" : true, "serial_number" : true, "status" : true, "lat" : true, "lng" : true})
            
            for(let i =0; i<get_data.data.length; i++){
                get_data.data[i].avatar_file_url = get_data.data[i].avatar_file_url.replace('172.16.41.114:3000', '211.204.122.90:10891')
            }
            
            res.send(get_data)
        } else if(req.params.what == 'mobile'){
            const mobile = req.params === undefined ? req.thing : req.params.thing
            get_data.data = await api_v1_person_user.find({"mobile" : mobile})
            get_data.camera = await api_v3_device_camera.find({},{"name" : true, "location" : true, "serial_number" : true, "status" : true, "lat" : true, "lng" : true})
            
            for(let i =0; i<get_data.data.length; i++){
                get_data.data[i].avatar_file_url = get_data.data[i].avatar_file_url.replace('172.16.41.114:3000', '211.204.122.90:10891')
            }
            
            res.send(get_data)
        } else if(req.params.what == 'entered'){
            const entered = req.params === undefined ? req.thing : req.params.thing
            get_data.data = await api_v1_person_user.find({"entered" : entered})
            get_data.camera = await api_v3_device_camera.find({},{"name" : true, "location" : true, "serial_number" : true, "status" : true, "lat" : true, "lng" : true})
            
            for(let i =0; i<get_data.data.length; i++){
                get_data.data[i].avatar_file_url = get_data.data[i].avatar_file_url.replace('172.16.41.114:3000', '211.204.122.90:10891')
            }
            
            res.send(get_data)
        } else {
            res.status(400).send({err:"잘못된 형식 입니다."})
        }
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.post('/', async function(req, res){
 
    let json = req.body
    let authority = "admin";
    let operation_auth = "admin";
    let department_id = "";
    let mail = "";
    
    console.log(json)

    client.publish(
        '/user/add/' + id,
        JSON.stringify({
          ...json,
          "id": id,
          "type": 1,
          "authority": authority,
          "operation_auth": operation_auth,
          "department_id": department_id,
          "mail": mail,
          "account": "5f5f1b5e146373e6fee1afcc",
          "groups_obids": ["615272b47071f710f34a839a"]
        })
    )

    client.on('message', function(topic, message) {
        if (topic.indexOf('/user/add/result/'+id) > -1) {
          let result = JSON.parse(message.toString())
      
          if(result.result) {
            res.send("등록 되었습니다.")
          } else {
            console.log(result.msg)
          }
        }
      })
})

module.exports = router;