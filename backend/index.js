// Require the framework and instantiate it
const fastify = require('./server.js')
// const gql = require('fastify-gql')
// const schema = require('./schema')
const cors = require('cors')
// const graphqlHTTP = require( 'express-graphql');
const boom = require('boom')
const jwt =  require('jsonwebtoken');
const cookie = require('cookie');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const crypto = require('crypto')
const tf = require('@tensorflow/tfjs-node');
const faceapi = require('@vladmandic/face-api');
const { spawn } = require('child_process');
const fetch = require('node-fetch')
const multer = require('multer');
const canvas = require("canvas");
const { loadImage, Canvas, Image, ImageData } = canvas;
const fs = require('fs');
//model
const User = require('./models/User')
const Users = require('./models/api/v1/person/user')//등록된 사용자 목록

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

// Register Fastify GraphQL
// fastify.register(graphqlHTTP, {
//     schema,
//     graphiql: true
// })
fastify.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
fastify.use(bodyParser.json({limit: '50mb'}));
fastify.use(cors())
fastify.use('/user',usersRouter);
fastify.use('/account',accountRouter);
fastify.use('/access',accessRouter);
fastify.use('/alarm',alarmRouter);
fastify.use('/camera',cameraRouter);
fastify.use('/camera_fail',cameraFailRouter);
fastify.use('/camera_filelist',cameraFilelistRouter);
fastify.use('/camera_monitor',cameraMonitorRouter);
fastify.use('/gateway',gatewayRouter);
fastify.use('/group',groupRouter);
fastify.use('/glogs',glogsRouter);
fastify.use('/statistics',statisticsRouter);
fastify.use('/history',historyRouter);
fastify.use('/operation',operationRouter);

// fastify.use(express.static(path.join(__dirname, 'uploads')));
fastify.use('/uploads', express.static(path.join(__dirname, 'uploads')));
fastify.use('/image',express.static('./image'));
fastify.use('/stream',express.static('./videos'));

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerOption = require('./routes/swagger');
const swaggerSpec = swaggerJSDoc(swaggerOption);
const swaggerUi = require('swagger-ui-express');
 
fastify.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

Promise.all([
    // tf.setBackend('webgl'),
    faceapi.nets.ssdMobilenetv1.loadFromDisk(`${__dirname}/face-models/`),
    faceapi.nets.faceRecognitionNet.loadFromDisk(`${__dirname}/face-models/`),
    faceapi.nets.faceLandmark68Net.loadFromDisk(`${__dirname}/face-models/`),
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData,fetch: fetch }),
])

const upload = multer({ storage: multer.memoryStorage() });

fastify.post('/face-detect',upload.single('image'),async function (req, res) {
    const UserList = await Users.find();
    const imageBase64 = await req.file.buffer.toString('base64'); //사진 데이터 base64로 변경
    
    const img = new Image();
    img.src = await "data:"+req.file.type+";base64,"+imageBase64 //이미지 태그 생성

    console.time()
    const detections = await faceapi.detectAllFaces(img) //얼굴 인식
    .withFaceLandmarks()
    .withFaceDescriptors();
    console.timeEnd();
    

    // const labeledDescriptors = await Promise.all(
    //     UserList.map(async user => {
    //         const imageDir = await canvas.loadImage(user.avatar_file_url.replace('http://172.16.135.89:3000','.'))
    //         const detections = await faceapi.detectSingleFace(imageDir)
    //         .withFaceLandmarks()
    //         .withFaceDescriptor();
    //         return (
    //             new faceapi.LabeledFaceDescriptors(
    //                 String(user._id),
    //                 [detections.descriptor]
    //             )
    //         )
    //     })
    // ); //db에서 얼굴 데이터 가져오기

    const labeledDescriptors = await Promise.all(
        UserList.map(async user => {
            return (
                new faceapi.LabeledFaceDescriptors(
                    user.name+"|"
                    +user.location+"|"
                    +user.department_id+"|"
                    +user.position+"|"
                    +user.mobile+"|"
                    +user.mail+"|"
                    +user.gender+"|"
                    +user.type+"|"
                    +user.avatar_file_url+"|"
                    +user.create_at,
                    [new Float32Array(Object.values(JSON.parse(user.face_detection)))]
                    
                )
            )
        })
    ); //db에서 얼굴 데이터 가져오기

    // console.log(labeledDescriptors);
    // console.log(JSON.stringify(labeledDescriptors[0]),new Float32Array(Object.values(JSON.parse(JSON.stringify(labeledDescriptors[0])))));

    //얼굴,라벨 매치
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6)
    const bestMatch = detections.map(d => faceMatcher.findBestMatch(d.descriptor)) 
    
    const filteredMatch = bestMatch.filter(d => d._distance < 0.5)

    res.send(filteredMatch);
})

let child;
fastify.post('/strat', async function(req, res) {
    let temp = '-v info -i '+req.body.uri+' -c:v copy -c:a copy -bufsize 1835k -pix_fmt yuv420p -flags -global_header -hls_time 10 -hls_list_size 6 -hls_wrap 10 -start_number 1 /var/www/backend/videos/'+req.body.sn+'.m3u8'
    let args = temp.split(' ')
    child = spawn('ffmpeg', args)
})
fastify.post('/login', async function(req, res) {
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
fastify.get('/auth', async function(req, res) {
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
        await fastify.listen(3000,'0.0.0.0')
        fastify.swagger()
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
