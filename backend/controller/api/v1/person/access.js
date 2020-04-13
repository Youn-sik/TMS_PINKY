const boom = require('boom')
const api_v1_person_access = require('../../../../models/api/v1/person/access')

// Get all api_v1_person_access
exports.getapi_v1_person_access = async (req, reply) => {
    try {
        const get_data = await api_v1_person_access.find()
        return get_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

// Get single api_v1_person_access by ID
exports.getSingleapi_v1_person_access = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_person_access.findById(id)
        return get_single_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.addapi_v1_person_access = async (req, reply) => {
    try {
        const add = new api_v1_person_access(req)
        return add.save()
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updateapi_v1_person_access = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.params === undefined ? req : req.params
        const update = await api_v1_person_access.findByIdAndUpdate(id, update_data, {new: true })
        return update
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deleteapi_v1_person_access = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_person_access.findByIdAndRemove(id)
        return delete_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getapi_v1_person_access_depend_on_user = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const depend_on_data = await api_v1_person_access.find({ reception_user_id : id })
        return depend_on_data
    }catch (err) {
        throw boom.boomify(err)
    }
}
