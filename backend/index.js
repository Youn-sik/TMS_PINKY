// Require the framework and instantiate it
const app = require('./server.js')
const cors = require('cors')
const boom = require('boom')
const jwt =  require('jsonwebtoken');
const cookie = require('cookie');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const crypto = require('crypto')

//model
const User = require('./models/User')

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
    console.log(token);
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
    res.send({
        auth, 
        user_id:tokenAuth.user_id, 
        authority : tokenAuth.authority,
        tempLimit : tokenAuth.tempLimit,
        tempType : tokenAuth.tempType,
    });
});



//const mongoose = require('mongoose')
const routes = require('./routes')
const swagger = require('./config/swagger')

// Run the server!
const start = async () => {
    try {
        await app.listen(3000,'0.0.0.0')
        app.swagger()
        app.log.info(`server listening on ${app.server.address().port}`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
start()
