const boom = require('boom')
const api_v3_device_camera = require('../../../../models/api/v3/device/camera')

// Get all api_v3_device_camera
exports.getapi_v3_device_camera = async (req, reply) => {
    try {
        const get_data = await api_v3_device_camera.find()
        return get_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

// Get single api_v3_device_camera by ID
exports.getSingleapi_v3_device_camera = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v3_device_camera.findById(id)
        return get_single_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.addapi_v3_device_camera = async (req, reply) => {
    try {
        const add = new api_v3_device_camera(req)
        return add.save()
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updateapi_v3_device_camera = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.params === undefined ? req : req.params
        const update = await api_v3_device_camera.findByIdAndUpdate(id, update_data, {new: true })
        return update
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deleteapi_v3_device_camera = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v3_device_camera.findByIdAndRemove(id)
        return delete_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getapi_v3_device_camera_depend_on_gateway = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const depend_on_data = await api_v3_device_camera.find({ gateway_id : id })
        return depend_on_data
    }catch (err) {
        throw boom.boomify(err)
    }
}
