// Require the framework and instantiate it
const fastify = require('./server.js')
const gql = require('fastify-gql')
const schema = require('./schema')
const cors = require('cors')

// Register Fastify GraphQL
fastify.register(gql, {
    schema,
    graphiql: true
})

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
fastify.use(cors())
// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000)
        fastify.swagger()
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
