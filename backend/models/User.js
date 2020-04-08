const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_id: String,
    user_pw: String,
    user_lang: String,
    user_name: String
})

module.exports = mongoose.model('User', userSchema)
