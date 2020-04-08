const boom = require('boom')
const All_Access = require('../models/All_access')

// Get single Access Authorized_access
exports.getSingleAll_Access = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const All_Accesss = await All_Access.findById(id)
        return All_Accesss
    } catch (err) {
        throw boom.boomify(err)
    }
}

//Get single Authorized_access's Access Authorized_access
exports.getAuthorized_accesssAll_Access = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const All_Accesss = await All_Access.find({ Authorized_access_fkid : id })
        return All_Accesss
    }catch (err) {
        throw boom.boomify(err)
    }
}
