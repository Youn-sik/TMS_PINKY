// Require the fastify framework and instantiate it
const fastify = require('fastify')({
	logger: true
})

// Require external modules
const mongoose = require('mongoose')
const config = require("./config/config");

// Connect to DB
mongoose
	.connect('mongodb://localhost/cloud40')
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log(err))

module.exports = fastify