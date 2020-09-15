const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_id: { type: String, unique: true, required : true },
    user_pw: String,
    user_lang: String,
    user_name: String,
    salt : String,
    authority : String,
    tempLimit : {type : Number, default : 37.5},
    tempType : {type : Number, default : 1} // 1 : 온도로 표시, 2 : 문자로 표시
})

module.exports = mongoose.model('account', userSchema)