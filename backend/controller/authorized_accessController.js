const boom = require('boom')
const Authorized_access = require('../models/Authorized_access')

// Get all Authorized_accesss
exports.getAuthorized_accesss = async (req, reply) => {
    try {
        const Authorized_accesss = await Authorized_access.find()
        return Authorized_accesss
    } catch (err) {
        throw boom.boomify(err)
    }
}

// Get single Authorized_access by ID
exports.getSingleAuthorized_access = async (req, reply) => {
    try {        
        const id = req.params === undefined ? req.id : req.params.id
        console.log(id);
        const Authorized_accesss = await Authorized_access.findById(id)
        return Authorized_accesss
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.addAuthorized_access = async (req, reply) => {
    try {
        const Authorized_accesss = new Authorized_access(req.body)
        return Authorized_accesss.save()
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updateAuthorized_access = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const Authorized_accesss = req.body
        const { ...updateData } = Authorized_accesss
        const update = await Authorized_access.findByIdAndUpdate(id, updateData, {new: true })
        return update
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deleteAuthorized_access = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const Authorized_accesss = await Authorized_access.findByIdAndRemove(id)
        return Authorized_accesss
    } catch (err) {
        throw boom.boomify(err)
    }
}
