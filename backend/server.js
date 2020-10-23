// Require the fastify framework and instantiate it
const express = require('express')({
	logger: true
})

// Require external modules
const mongoose = require('mongoose')
const config = require("./config/config");

// Connect to DB
mongoose
	.connect('mongodb://kool:master@127.0.0.1:27017/cloud40',{ 
		useNewUrlParser: true ,
		useUnifiedTopology: true,
		poolSize:8,
		useFindAndModify: false,
		socketTimeoutMS: 1000*60*10, //10분
	})
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log(err))

module.exports = express
