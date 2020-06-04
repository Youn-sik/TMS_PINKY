const boom = require('boom')
const api_v1_person_user = require('../../../../models/api/v1/person/user')

// Get all api_v1_person_user
exports.getapi_v1_person_users = async (req, reply) => {
    try {
        const type = req.params === undefined ? req.type : req.params.type
        const get_data = await api_v1_person_user.find({type : type})
        return get_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

// Get single api_v1_person_user by ID
exports.getSingleapi_v1_person_user = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_person_user.findById(id)
        return get_single_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getapi_v1_person_every_type_users = async (req, reply) => {
    try {
        const get_data = await api_v1_person_user.find()
        return get_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.addapi_v1_person_user = async (req, reply) => {
    try {
        const add = new api_v1_person_user(req)
        return add.save()
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updateapi_v1_person_user = async (req, reply) => {
    try {
        const _id = req.params === undefined ? req._id : req.params._id
        const update_data = req.params === undefined ? req : req.params
        const update = await api_v1_person_user.findByIdAndUpdate(_id, update_data, {new: true })
        return update
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deleteapi_v1_person_user = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_person_user.findByIdAndRemove(id)
        return delete_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getapi_v1_person_user_depend_on_user = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const depend_on_data = await api_v1_person_user.find({ _id : id })
        return depend_on_data
    }catch (err) {
        throw boom.boomify(err)
    }
}
