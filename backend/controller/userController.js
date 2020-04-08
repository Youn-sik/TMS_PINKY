const boom = require('boom')

const User = require('../models/User')
const Authorized_access = require('../models/Authorized_access')

exports.getUser = async () => {
    try {
        const users = await User.find()
        return users
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getSingleUser = async req => {
    try {   
        const id = req.params === undefined ? req.id : req.params.id
        const user = await User.findById(id)
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
