const boom = require('boom')
const User = require('../models/User')
const Authorized_access = require('../models/Authorized_access')
const jwt =  require('jsonwebtoken');
exports.getUsers = async () => {
    try {
        const users = await User.find()
        return users
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.login = async req => {
    try {   
        const user_id = req.params === undefined ? req.user_id : req.params.user_id
        const user_pw = req.params === undefined ? req.user_pw : req.params.user_pw
        const user = await User.findOne({ user_id: user_id, user_pw : user_pw })
        if(user !== null) {
            let token = jwt.sign({
                    user_id:user.id
                },
                'jjh',//시크릿 키 배포시 가려야 함
                {
                    expiresIn:'5h'
                }
            )
            return {"user_id":token}
        }
        return user
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getSingleUser = async req => {
    try {   
        const user_id = req.params === undefined ? req.user_id : req.params.user_id
        const user_pw = req.params === undefined ? req.user_pw : req.params.user_pw
        const user = await User.findOne({ user_id: user_id, user_pw : user_pw })
        return user
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getUsersAuthorized_accesss = async req => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const Authorized_accesss = await Authorized_access.find({ user_fkid : id })
        return Authorized_accesss
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.addUser = async req => {
    try {
        const add = new User(req)
        return add.save()
    } catch (err) {
        throw boom.boomify(err)
    }
}  
