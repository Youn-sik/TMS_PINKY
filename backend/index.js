// Require the framework and instantiate it
const app = require('./server.js')
const cors = require('cors')
const boom = require('boom')
const jwt =  require('jsonwebtoken');
const cookie = require('cookie');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const schedule = require('node-schedule');
const moment = require('moment');
const fs = require('fs');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const https = require('https')
const http = require('http')
const exec = require('child_process').exec;

const options = {
    key: fs.readFileSync('/etc/emqx/certs/emqx.key'),
    cert: fs.readFileSync('/etc/emqx/certs/server.pem')
}

//model
const User = require('./models/User')
const Access = require('./models/api/v1/person/access')

//router
const usersRouter = require('./routes/api/v1/person/user');
const accessRouter = require('./routes/api/v1/person/access');
const groupRouter = require('./routes/api/v1/group/group');
const glogsRouter = require('./routes/api/v1/group/glogs');
const alarmRouter = require('./routes/api/v2/device/alarm');
const cameraRouter = require('./routes/api/v3/device/camera');
const cameraFailRouter = require('./routes/api/v3/device/camera_fail');
const cameraFilelistRouter = require('./routes/api/v3/device/camera_filelist');
const cameraMonitorRouter = require('./routes/api/v3/device/camera_monitor');
const gatewayRouter = require('./routes/api/v3/device/gateway');
const statisticsRouter = require('./routes/api/v3/device/statistics');
const historyRouter = require('./routes/api/v1/person/history');
const operationRouter = require('./routes/api/v1/person/operation');
const accountRouter = require('./routes/account');

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors())

//auth middle-ware
app.use(function (req, res, next) {
    if(req.path.indexOf('/api-docs') > -1 ){
        next()
    } else if (req.path !== '/login' && req.headers.authorization && req.headers.authorization !== 'undefined') {
        req.headers.authorization = req.headers.authorization.replace('Bearer ','');
        const token = req.headers.authorization;
        jwt.verify(token, 'jjh', (err) => {
            if (err) {
                res.status(401).json({ err: '유효하지 않는 토큰입니다.' });
            } else {
                next();
            }
        });
    } else if(req.path === '/login' || req.path.indexOf('.jpg') > -1 || req.path.indexOf('.png') > -1 || req.path.indexOf('uploads') > -1 || req.path.indexOf('license_check') > -1){
        next()
    }  else {
        res.status(401).json({ err: '유효하지 않는 토큰입니다.' });
    }
});

//router
app.use('/user',usersRouter);
app.use('/account',accountRouter);
app.use('/access',accessRouter);
app.use('/alarm',alarmRouter);
app.use('/camera',cameraRouter);
app.use('/camera_fail',cameraFailRouter);
app.use('/camera_filelist',cameraFilelistRouter);
app.use('/camera_monitor',cameraMonitorRouter);
app.use('/gateway',gatewayRouter);
app.use('/group',groupRouter);
app.use('/glogs',glogsRouter);
app.use('/statistics',statisticsRouter);
app.use('/history',historyRouter);
app.use('/operation',operationRouter);

//static
app.use('/uploads', express.static("/var/www/backend/uploads"));
app.use('/image',express.static('/var/www/backend/image'));
app.use('/stream',express.static('/var/www/backend/videos'));
app.use('/noImage',express.static('/var/www/backend/defaultImage'));

//swagger
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerOption = require('./routes/swagger');
const swaggerSpec = swaggerJSDoc(swaggerOption);
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.post('/login', async function(req, res) {
    try {   
        const user_id = req.body === undefined ? req.user_id : req.body.user_id
        const user_pw = req.body === undefined ? req.user_pw : req.body.user_pw
        const user = await User.findOne({ user_id: user_id })
        if(!user) {
            res.status(400).send({err:"존재하지 않는 계정입니다"})
            return 0;
        }
        crypto.pbkdf2(user_pw, user.salt, 105614, 64, 'sha512', (err, key) => {
            if(key.toString('base64') === user.user_pw) {
                let token = jwt.sign({
                        user_id:user.id,
                        authority: user.authority,
                        tempLimit : user.tempLimit,
                        tempType : user.tempType,
                    },
                    'jjh',
                    {
                        expiresIn:'7d',
                        issuer: 'koolsign_access_control',
                        subject:'userInfo'
                    }
                )
                res.send({
                    "token":token,
                    // authority : user.authority,
                    // tempLimit : user.tempLimit,
                    // tempType : user.tempType,
                })
            } else {
                res.status(400).send({err:"존재하지 않는 계정입니다"})
            }
        })
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

//유효한 토큰인지 검사
app.get('/auth', async function(req, res) {
    let token = req.query.token;
    let tokenAuth = {user_id:null};
    if(token === undefined && req.headers.cookie !== undefined) {
        token = cookie.parse(req.headers.cookie).token;
    }
    let auth;
    if(token === ''){
        console.log("Token is empty")
        auth = false;
    } else {
        try {
            tokenAuth = jwt.verify(token,'jjh');
            auth = true;
        } catch(err) {
            console.log(err)
            auth = false;
        }
    }

    if(tokenAuth.user_id) {
        const user = await User.findById({ _id: tokenAuth.user_id })
        res.send({
            auth, 
            user_id:tokenAuth.user_id, 
            authority : tokenAuth.authority,
            tempLimit : user.tempLimit,
            tempType : user.tempType,
        });
    } else {
        res.status(400).send({
            auth
        });
    }
    
});

//const mongoose = require('mongoose')
const routes = require('./routes')
const swagger = require('./config/swagger')
let {term} = require('./deleteDate.json')

app.get('/schedule',(req,res) => {
    res.send({term})
})

app.put('/schedule',(req,res) => {
    fs.writeFileSync('/var/www/backend/deleteDate.json',`{"term":${req.body.term}}`,{
        mode:0o777
    })
    term = parseInt(req.body.term)
    res.send({term:term})
})

//사진보관 기간 설정
// let term = 28; //기본 보관 날짜 28일 4주
let s = schedule.scheduleJob('0 0 0 * * *', async function(){//스케쥴 설정
    let dateTime = moment().subtract(term-1,'days').format('YYYY-MM-DD') + " 00:00:00"//moment 보관 기간 만큼을 뺀 날짜
    let date = moment().subtract(term,'days').format('YYYYMMDD')

    let accesses = []

    //DB삭제
    await Access.deleteMany({
        access_time : {$lt:dateTime}
    })

    //사진 삭제
    exec(`find /var/www/backend/uploads/accesss/temp/ -mindepth 1 -maxdepth 1 -mtime +${term - 1} -type d -exec rm -rf {} \\;`)
});



// Run the server!
const start = async () => {
    await http.createServer(options,app).listen(3000)
    // await app.listen(3000,'0.0.0.0')
}
start()
