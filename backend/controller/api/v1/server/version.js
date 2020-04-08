const boom = require('boom')
const api_v1_server_version = require('../../../../models/api/v1/server/version')

// Get all api_v1_server_version
exports.getapi_v1_server_version = async (req, reply) => {
    try {
        const get_data = await api_v1_server_version.find()
        return get_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

// Get single api_v1_server_version by ID
exports.getSingleapi_v1_server_version = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_server_version.findById(id)
        return get_single_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.addapi_v1_server_version = async (req, reply) => {
    try {
        const add = new api_v1_server_version(req)
        return add.save()
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updateapi_v1_server_version = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.params === undefined ? req : req.params
        const update = await api_v1_server_version.findByIdAndUpdate(id, update_data, {new: true })
        return update
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deleteapi_v1_server_version = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_server_version.findByIdAndRemove(id)
        return delete_data
    } catch (err) {
        throw boom.boomify(err)
    }
}
