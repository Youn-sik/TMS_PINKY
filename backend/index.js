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

// fastify.use(express.static(path.join(__dirname, 'uploads')));
fastify.use('/uploads', express.static(path.join(__dirname, 'uploads')));
fastify.use('/image',express.static('./image'));


fastify.post('/login', async function(req, res) {
    try {   
        const user_id = req.body === undefined ? req.user_id : req.body.user_id
        const user_pw = req.body === undefined ? req.user_pw : req.body.user_pw
        const user = await User.findOne({ user_id: user_id, user_pw : user_pw })
        if(user !== null) {
            let token = jwt.sign({
                    user_id:user.id
                },
                'jjh',//시크릿 키 배포시 가려야 함
                {
                    expiresIn:'5h'
                }
            )
            res.send({"token":token})
        } else {
            res.status(400)
            res.send({err:"존재하지 않는 계정입니다"})
        }
    } catch (err) {
        throw boom.boomify(err)
    }
});

//유효한 토큰인지 검사
fastify.get('/auth', async function(req, res) {
    let token = req.query.token;
    if(token === undefined && req.headers.cookie !== undefined) {
        token = cookie.parse(req.headers.cookie).token;
    }
    let auth;
    if(token === ''){
        auth = false;
    } else {
        try {
            let tokenAuth = jwt.verify(token,'jjh');
            auth = true;
        } catch(err) {
            auth = false;
        }
    }
    res.send({auth});
});

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
