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
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/image',express.static('./image'));
app.use('/stream',express.static('./videos'));
app.use('/noImage',express.static('./defaultImage'));

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
            res.send({err:"존재하지 않는 계정입니다"})
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
                    authority : user.authority,
                    tempLimit : user.tempLimit,
                    tempType : user.tempType,
                })
            } else {
                res.status(400)
                res.send({err:"존재하지 않는 계정입니다"})
            }
        })
    } catch (err) {
        throw boom.boomify(err)
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
        res.send({
            auth
        });
    }
    
});



//const mongoose = require('mongoose')
const routes = require('./routes')
const swagger = require('./config/swagger')


//사진보관 기간 설정
let term = 7; //기본 보관 날짜 7일
let s = schedule.scheduleJob('0 0 0 * * *', async function(){//스케쥴 설정
    let dateTime = moment().subtract(term-1,'days').format('YYYY-MM-DD') + " 00:00:00"//moment 보관 기간 만큼을 뺀 날짜
    let result = await Access.find().lt('access_time',dateTime)
    if(result.length > 0){
        let images = result.map(access => access.avatar_file_url);
        let ip = images[0].split(":3000");
        images.map(image => {
            fs.unlink(image.avatar_file_url.replace(ip+':3000/','/var/www/backend/'),() => {})
        })
        await Access.updateMany(
            {access_time: {$lt:dateTime}},
            {$set:{avatar_file_url : ip+":3000"+"/noImage/noImage.png"}
        })
    }   
});

app.get('/schedule',(req,res) => {
    res.send({term})
})

app.put('/schedule',(req,res) => {
    term = req.body.term;
    res.send({term})
})


// Run the server!
const start = async () => {
    await app.listen(3000,'0.0.0.0')
}
start()
