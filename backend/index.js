// Require the framework and instantiate it
const fastify = require('./server.js')
// const gql = require('fastify-gql')
const schema = require('./schema')
const cors = require('cors')
const graphqlHTTP = require( 'express-graphql');
const jwt =  require('jsonwebtoken');
const cookie = require('cookie');
// Register Fastify GraphQL
// fastify.register(graphqlHTTP, {
//     schema,
//     graphiql: true
// })
const context = (req) => {
    let token = req.headers.authorization;
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
    return {auth};
}
fastify.use(cors())

fastify.use('/graphiql', 
    graphqlHTTP( (req,res) =>({
        schema: schema,
        graphiql: true,
        context : context(req),
    }))
);

//const mongoose = require('mongoose')
const routes = require('./routes')
const swagger = require('./config/swagger')
fastify.register(require('fastify-swagger'), swagger.options)

// Connect to DB
/*mongoose.connect(`mongodb://localhost/cloud40`)
.then(() => console.log(`MongoDB connected…`))
.catch(err => console.log(err))
*/

routes.forEach((route, index) => {
    fastify.route(route)
})
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
