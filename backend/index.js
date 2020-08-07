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
const { spawn } = require('child_process');
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

// fastify.get('/strea',function(req,res) {
//     var parser = m3u8.createStream();
//     var file   = fs.createReadStream('/media/jeon/data/stream/index.m3u8');
//     file.pipe(parser);

//     parser.on('item', function(item) {
//     // emits PlaylistItem, MediaItem, StreamItem, and IframeStreamItem
//     });
//     parser.on('m3u', function(m3u) {
//     // fully parsed m3u file
//     });
// })
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
        crypto.pbkdf2(user_pw, user.salt, 105614, 64, 'sha512', (err, key) => {
            if(key.toString('base64') === user.user_pw) {
                let token = jwt.sign({
                        user_id:user.id
                    },
                    'jjh',//시크릿 키 배포시 가려야 함
                    {
                        expiresIn:'10h'
                    }
                )
                res.send({"token":token})
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
    let tokenAuth = {user_id:null};;
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
    res.send({auth,user_id:tokenAuth.user_id});
});

// new hls(server, {
//     provider: {
//         exists: (req, cb) => {
//             const ext = req.url.split('.').pop();

//             if (ext !== 'm3u8' && ext !== 'ts') {
//                 return cb(null, true);
//             }

//             fs.access(__dirname + req.url, fs.constants.F_OK, function (err) {
//                 if (err) {
//                     console.log('File not exist');
//                     return cb(null, false);
//                 }
//                 cb(null, true);
//             });
//         },
//         getManifestStream: (req, cb) => {
//             const stream = fs.createReadStream(__dirname + req.url);
//             cb(null, stream);
//         },
//         getSegmentStream: (req, cb) => {
//             const stream = fs.createReadStream(__dirname + req.url);
//             cb(null, stream);
//         }
//     }
// });
// const context = (req) => {
//     let token = req.headers.authorization;
//     if(token === undefined && req.headers.cookie !== undefined) {
//         token = cookie.parse(req.headers.cookie).token;
//     }
//     let auth;
//     if(token === ''){
//         auth = false;
//     } else {
//         try {
//             let tokenAuth = jwt.verify(token,'jjh');
//             auth = true;
//         } catch(err) {
//             auth = false;
//         }
//     }
//     return {auth};
// }

// fastify.use('/graphiql', 
//     graphqlHTTP( (req,res) =>({
//         schema: schema,
//         graphiql: true,
//         context : context(req),
//     }))
// );

// fastify.route({
//     method: 'GET',
//     url: '/token_auth',
//     handler: function (request, reply) {
//         let auth
//         try {
//             let tokenAuth = jwt.verify(request.query.token,'jjh');
//             auth = true;
//         } catch (err) {
//             auth = false;
//         }
        
//         reply.send({ auth: auth });
//     }
//   })

//const mongoose = require('mongoose')
const routes = require('./routes')
const swagger = require('./config/swagger')
// fastify.register(require('fastify-swagger'), swagger.options)

// Connect to DB
/*mongoose.connect(`mongodb://localhost/cloud40`)
.then(() => console.log(`MongoDB connected…`))
.catch(err => console.log(err))
*/

// routes.forEach((route, index) => {
//     fastify.route(route)
// })
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
