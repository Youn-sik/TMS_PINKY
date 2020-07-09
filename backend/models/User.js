const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_id: { type: String, unique: true, required : true },
    user_pw: String,
    user_lang: String,
    user_name: String,
    salt : String,
})

module.exports = mongoose.model('account', userSchema)