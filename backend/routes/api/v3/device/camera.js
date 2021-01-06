var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v3_device_camera = require('../../../../models/api/v3/device/camera')
const Operation = require('../../../../models/api/v1/person/operation')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul");
const execSync = require('child_process').execSync;
const api_v3_device_license = require('../../../../models/api/v3/device/license.js')
const CryptoJS = require('crypto-js')
const ping = require('ping');
const fs = require('fs')
const mariadb = require('mariadb');
const jwt = require('jsonwebtoken')

// const pool = mariadb.createPool({
// 	connectionLimit : 30,
// 	host : "101.79.73.84",
// 	prot : "3306",
// 	user : "koolsign",
//     password : "q1w2e3r4",
//     database: "cloud31_license",
//     charset : 'utf8_general_ci'
// })

let qrystr = [{
    "c_license_type" : "standard",	
    "c_license_month" : 'limit',	
    "c_company" : "함안군",	
    "c_country":"kr",	
    "c_name":"손영호",	
    "c_email":"yhsohn@koolsign.net",	
    "c_mac":"70:85:c2:81:ca:fc",	
    "c_cnt" : 500,		
    "c_end":"2070-11-17",	
    "c_license_key1":"50500-99999-00000-ALIM-94SQ",	
    "c_license_key2":"U2FsdGVkX1/pcs7DTGoQeyuc6yqEuPw4Rk+wrhHKs4aJ7S7ksy3L/eOAL135NgQT"
}]

function server_mac_check(eth) {
    // let dump = execSync(`/sbin/ifconfig | grep ${eth}`) //우분투 버전 문제 인지 mac 주소가 1행에 출력이 안된다
    let dump = execSync(`/sbin/ifconfig | grep ether`)
    let mac = String(dump).match(/[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}/i)

    return mac[0]
}

function encrypt (data,key) {
    return CryptoJS.AES.encrypt(JSON.stringify(data),key).toString();
}

function decrypt (data,key) {
    try {
        const bytes = CryptoJS.AES.decrypt(data,key);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (err) {
        console.error(err);
        return;
    }
}

function license_on_off_check (data) {
    if(data.c_type === 'off') {
        let file = fs.existsSync('/var/www/backend/license.txt')

        if(!file) {
            result({"result" : false , 'msg':"라이센스를 등록해주세요"})
        } else {
            let msg = fs.readFileSync('/var/www/backend/license.txt')
            let val = decrypt(msg.toString(),'!@#koolsign_cloud3_!@#$')

            if(server_mac_check(val.license_eth) != val.info[0].mac) {
                return({"result":false, "msg" : "올바르지 않은 맥주소 입니다 라이센스를 다시 등록해주세요."})
            }

            let current_date = moment().format('YYYY-MM-DD')
            let license_date = val.license_end
            if(current_date > license_date) {
                return({"result":false, "msg" : "라이센스 기간이 지났습니다 다시 등록해 주세요."})
            }
        }

        return {'result' : true};
    } else {
        return {'result' : true};
    }
    
}

async function license_check(type,req){
    let license_type = 'development' //이정보를 어디에 저장할것인가
    let stb_cnt

    req.headers.authorization = req.headers.authorization.replace('Bearer ','');
    const token = req.headers.authorization;
    
    let token_result = true

    jwt.verify(token, 'jjh', (err) => {
        if (err) {
            token_result = false
        }
    })
    if(!token_result)
        return({"result":false,"msg":"유효하지 않느 토큰입니다."})

    if(license_type === 'development') {
        stb_cnt = '100000'
        return({"result" : true})
    } else {
        let qryResult = await api_v3_device_license.find({})
        if(qryResult.length < 1) {
            //라이센스 등록으로 이동
            return({"result":false, "msg" : "라이센스를 등록해주세요."})
        } else {
            val = qryResult[0]

            if(val.c_type === 'off') {
                let result = license_on_off_check(val)
                return result
            } else {
                // let conn = await pool.getConnection();
                // let sqlstr = `select * from g_license where c_license_key1="${val.c_license_key1}"`
                // let qrystr = await conn.query(sqlstr)
                // conn.release();
                
                if(qrystr.length < 1) {
                    //라이센스 등록으로 이동
                    return({"result":false, "msg" : "올바르지 않은 라이센스 입니다 라이센스를 다시 등록해주세요."})
                } else {
                    let _val = qrystr[0]

                    //라이센스 비교 
                    let server1 = decrypt(val.c_license_key2,'!@#koolsign_cloud3_!@#$')
                    let server2 = decrypt(_val.c_license_key2,'!@#koolsign_cloud3_!@#$')
                    
                    server1 = server1.replace(/\s+/,"")
                    server2 = server2.replace(/\s+/,"")

                    //CI로 암호화된 문자열 복호화 하는버 필요
                    
                    if(server1 != server2) {
                        return({"result":false, "msg" : "올바르지 않은 라이센스 입니다 라이센스를 다시 등록해주세요."})
                    }

                    //등록된 맥주소 확인
                    let local_mac = server_mac_check(val.c_eth)
                    // let local_mac = '70:85:c2:82:35:5e'
                    
                    if(_val.c_mac != local_mac) {
                        return({"result":false, "msg" : "올바르지 않은 맥주소 입니다 라이센스를 다시 등록해주세요."})
                    } 


                    //날짜 체크
                    let current_date = moment().format('YYYY-MM-DD')
                    let license_date = _val.c_end

                    if(current_date > license_date){
                        return({"result":false, "msg" : "라이센스 기간이 지났습니다 다시 등록해 주세요."})
                    }

                    let current_devices = api_v3_device_camera.find({}).count()

                    //라이센스 서버에서 정해진 전체 단말기 수를 가져온다.
                    if(_val.c_settop_cnt == 'limit'){
                        stb_cnt = '100000'
                    } else {
                        stb_cnt = _val.c_settop_cnt
                    }

                    if(type === "addDevice" && current_devices === stb_cnt) {
                        return({"result":false , msg:"더 이상 단말기를 할당할 수 없습니다."})
                    }

                    return {"result" : true}
                }
            }
        }
    }
}

async function license_server_stb_count (data) {
    // let conn = await pool.getConnection();
    // let sqlstr = `select * from g_license where c_license_key1="${data.c_license_key1}"`
    // let qrystr = await conn.query(sqlstr)

    let val = qrystr[0]

    // conn.release();

    return val
}

async function license_file_write(data) {
    let file = fs.existsSync('/var/www/backend/license.txt')
    if(file){
        //이미 파일이 존재합니다.
        return({"result":false,'msg':"파일을 삭제 후 진행해주세요."})
    } else {
        let res = await ping.promise.probe("101.79.73.83");

        if(!res) {
            return({"result":false,'msg':"외부에 접속 할 수 있도록 인터넷을 설정해주세요."})
        } else {
            let stb_info = license_server_stb_count(data);

            let license_key2 = encrypt(data.c_mac,'!@#koolsign_cloud3_!@#$')
            let file_path = 'lisence.txt'

            let stb_cnt = ''
            if(stb_info['c_settop_cnt'] === 'limit') {
                stb_cnt = '10000';
            } else {
                stb_cnt = stb_info['c_settop_cnt']
            }

            let json_data = {
                "info" : [
                    {
                        "c_eth" : data['c_eth'],
                        "c_end" : stb_info['c_end'],
                        "stb_cnt" : stb_cnt,
                        "mac" : data['c_mac'],
                        "c_license_key1":data['c_license_key1'],
                        "c_license_key2":license_key2
                    }
                ]
            }

            msg = encrypt(json_data,'!@#koolsign_cloud3_!@#$')

            fs.writeFileSync("/var/www/backend/license.txt",msg)
            fs.chmodSync("/var/www/backend/license.txt",0777)
            // fs.chownSync
            // fs.chgrp
            return({"result":true})
        }
    }
}

async function license_check_before_save(license_data){
    let license_type = 'development' //이정보를 어디에 저장할것인가
    let stb_cnt
    if(license_type === 'development') {
        stb_cnt = '100000'
        return({"result" : true})
    } else {
        let val = license_data

        if(qrystr.length < 1) {
            //라이센스 등록으로 이동
            return({"result":false, "msg" : "올바르지 않은 라이센스 입니다."})
        } else {
            let _val = qrystr[0]

            //라이센스 비교 
            let server1 = license_data.c_mac
            let server2 = decrypt(_val.c_license_key2,'!@#koolsign_cloud3_!@#$')
            
            server1 = server1.replace(/\s+/,"")
            server2 = server2.replace(/\s+/,"")

            //CI로 암호화된 문자열 복호화 하는버 필요
            
            if(server1 != server2) {
                return({"result":false, "msg" : "올바르지 않은 라이센스 입니다."})
            }

            //등록된 맥주소 확인
            let local_mac = server_mac_check(val.c_eth)

            if(_val.c_mac != local_mac) {
                return({"result":false, "msg" : "올바르지 않은 맥주소 입니다."})
            } 


            //날짜 체크
            let current_date = moment().format('YYYY-MM-DD')
            let license_date = _val.c_end

            if(current_date > license_date){
                return({"result":false, "msg" : "라이센스 기간이 지났습니다."})
            }

            //라이센스 서버에서 정해진 전체 단말기 수를 가져온다.
            if(_val.c_settop_cnt == 'limit'){
                stb_cnt = '100000'
            } else {
                stb_cnt = _val.c_settop_cnt
            }

            return {"result" : true}
        }
    }
}

router.post("/license_save",async function (req, res) {
    try{
        let license_check = await license_check_before_save(req.body)
        if(!license_check.result){
            res.send(license_check)
            return 0;
        }

        if(req.body.c_type === "off"){
            res.send(await license_file_write(req.body))
            return 0;
        }
        
        s_ip = "172.16.135.13" //해당 서버의 ip
        s_mac = server_mac_check(req.body.c_eth)
        let result = await api_v3_device_license.find({})

        let msg = req.body.c_mac
        let license_key2 = encrypt(msg,'!@#koolsign_cloud3_!@#$')
        if(result.length > 0) {
            await api_v3_device_license.updateOne({"_id":result[0]._id},{
                'c_type': req.body.c_type,
                'c_mac': req.body.c_mac,
                'c_eth': req.body.c_eth,
                'c_license_key1': req.body.c_license_key1,
                'c_license_key2': license_key2,
                'regdate': moment().format("YYYY-MM-DD HH:mm:ss")
            })            
        } else {
            await api_v3_device_license.insertMany([{
                'c_type': req.body.c_type,
                'c_mac': s_mac,
                'c_eth': req.body.c_eth,
                'c_license_key1': req.body.c_license_key1,
                'c_license_key2': license_key2,
                'regdate': moment().format("YYYY-MM-DD HH:mm:ss")
            }])
        }
        
        res.send({"result":true})
        } catch(err){
            console.log(err)
        }
    
})

router.post("/license_check", async function (req,res) {
    let result = await license_check("none",req)
    res.send(result)
})

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

// router.get('/:id',async function(req, res) {
//     try {
//         const id = req.params === undefined ? req.id : req.params.id
//         const get_single_data = await api_v3_device_camera.findById(id)
//         res.send(get_single_data)
//     } catch (err) {
//         res.status(400).send({err:"잘못된 형식 입니다."})
//     }
// });

router.post('/',async function (req, res) {
    try {
        let result = await license_check(req.body.type,req)

        if(!result.result){
            res.send(result)
            return 0;
        }

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
        res.send({...add, ...result})
    } catch (err) {
        console.log(err);
        res.send({'error':'중복되는 시리얼 넘버'})
    }
});

router.put('/:id',async function(req, res) {
    try {
        let result = await license_check("none",req)

        if(!result.result){
            res.send(result)
            return 0;
        }

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
        res.send({...update , ...result})
    } catch (err) {
        res.send({'error':'중복되는 시리얼 넘버'})
    }
});

router.get('/license/get_license', async function(req,res) {
    let result = await api_v3_device_license.find({})
    let response = []

    if(result) {
        response = [{
            c_mac : result[0].c_mac,
            c_eth : result[0].c_eth,
            c_license_key1 : result[0].c_license_key1,
            c_type : result[0].c_type
        }]
    }

    res.send(response)
})

router.get('/get_device_cnt', async function(req,res) {
    let current_devices = await api_v3_device_camera.find({}).count()
    let limit = qrystr[0].c_cnt    
    res.send({
        "current_devices":current_devices,
        "limit":limit
    })
})

router.delete('/:id',async function(req, res) {
    try {
        let _result = await license_check("none",req)
        if(!_result.result){
            res.send(_result)
            return 0;
        }

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
            res.send({..._result , ...delete_data}) 
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
            res.send({..._result , ...result});
        }
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

module.exports = router;