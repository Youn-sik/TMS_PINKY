// Require the fastify framework and instantiate it
const fastify = require('express')({
	logger: true
})

// Require external modules
const mongoose = require('mongoose')
const config = require("./config/config");

// Connect to DB
mongoose
	.connect('mongodb://kool:master@mongo:27017/cloud40',{ useNewUrlParser: true ,useUnifiedTopology: true})
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log(err))

module.exports = fastify
