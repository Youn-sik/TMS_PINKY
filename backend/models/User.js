const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_id: { type: String, unique: true, required : true },
    user_pw: { type: String, required : true },
    user_lang: { type: String, required : true },
    user_name: { type: String, required : true },
    salt : String,
    authority : { type: String, required : true },
    tempLimit : {type : Number, default : 37.5},
    tempType : {type : Number, default : 1} // 1 : 온도로 표시, 2 : 문자로 표시
})
mongoose.set('useCreateIndex', true)
module.exports = mongoose.model('account', userSchema)