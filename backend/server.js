// Require the fastify framework and instantiate it
const express = require('express')({
	logger: true
})

// Require external modules
const mongoose = require('mongoose')
const config = require("./config/config");

// Connect to DB
mongoose
	.connect('mongodb://kool:master@127.0.0.1:27017/cloud40',{ useNewUrlParser: true ,useUnifiedTopology: true})
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log(err))

module.exports = express
