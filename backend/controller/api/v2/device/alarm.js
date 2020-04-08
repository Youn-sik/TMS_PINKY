const boom = require('boom')
const api_v2_device_alarm = require('../../../../models/api/v2/device/alarm')

// Get all api_v2_device_alarm
exports.getapi_v2_device_alarm = async (req, reply) => {
    try {
        const get_data = await api_v2_device_alarm.find()
        return get_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

// Get single api_v2_device_alarm by ID
exports.getSingleapi_v2_device_alarm = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v2_device_alarm.findById(id)
        return get_single_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.addapi_v2_device_alarm = async (req, reply) => {
    try {
        const add = new api_v2_device_alarm(req)
        return add.save()
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updateapi_v2_device_alarm = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.params === undefined ? req : req.params
        const update = await api_v2_device_alarm.findByIdAndUpdate(id, update_data, {new: true })
        return update
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deleteapi_v2_device_alarm = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v2_device_alarm.findByIdAndRemove(id)
        return delete_data
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getapi_v2_device_alarm_depend_on_user = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const depend_on_data = await api_v2_device_alarm.find({ user_id : id })
        return depend_on_data
    }catch (err) {
        throw boom.boomify(err)
    }
}

exports.getapi_v2_device_alarm_depend_on_device = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const depend_on_data = await api_v2_device_alarm.find({ device_id : id })
        return depend_on_data
    }catch (err) {
        throw boom.boomify(err)
    }
}

exports.getapi_v2_device_alarm_depend_on_trace = async (req, reply) => {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const depend_on_data = await api_v2_device_alarm.find({ trace_id : id })
        return depend_on_data
    }catch (err) {
        throw boom.boomify(err)
    }
}
