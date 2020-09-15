var express = require('express');
var router = express.Router();
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const boom = require('boom')
const api_v1_person_access = require('../../../../models/api/v1/person/access')

router.get('/',async function(req, res) {
    try {
        let get_data;
        let date = new RegExp(moment().format('YYYY-MM-DD'));
        let today = new RegExp(moment().format('YYYY-MM-DD'));
        if(req.query.type && req.query.type !== 'todayStatistics'&& req.query.type !== 'todayAttendance' && req.query.type !== 'temperature' && req.query.type !== 'attendance' && req.query.type !== 'deviceGroupAccesses') {
            get_data = await api_v1_person_access.find({avatar_type:req.query.type}).select('-avatar_file -avatar_contraction_data').limit(50000)
        } else if(req.query.type === 'todayStatistics') {
            get_data = await api_v1_person_access.aggregate([
                {
                    $match: {
                        access_time : {$regex:date}
                    }
                },
                {
                    $group: {
                        _id: {"type":"$avatar_type"},
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        lastDate : -1
                    }   
                }
            ])
        } 
        else if(req.query.type === 'deviceGroupAccesses') {
            get_data = await api_v1_person_access.aggregate([
                {
                    $sort:{"avatar_temperature" : -1}
                },
                { 
                    $project : { 
                        date_time : { 
                            $split: ["$access_time", " "] 
                        },
                        stb_sn:"$stb_sn",
                        avatar_temperature : "$avatar_temperature", 
                        avatar_file_url : "$avatar_file_url", 
                        name : "$name",
                        avatar_type : "$avatar_type"
                    } 
                },
                {
                    $project : {
                        date : {$arrayElemAt:["$date_time",0]},
                        time : {$arrayElemAt:["$date_time",1]},
                        stb_sn : 1,
                        avatar_temperature : 1,
                        avatar_file_url : 1,
                        name : 1, 
                        avatar_type: 1
                    }
                },
                { 
                    $project : { 
                        timeArr : { 
                            $split: ["$time", ":"] 
                        },
                        date : 1,
                        stb_sn : 1,
                        avatar_temperature : 1,
                        avatar_file_url : 1,
                        name : 1, 
                        avatar_type: 1
                    } 
                },
                { 
                    $project : { 
                        hour :  {
                            $arrayElemAt:["$timeArr",0]
                        },
                        date : 1,
                        stb_sn : 1,
                        avatar_temperature : 1,
                        avatar_file_url : 1,
                        name : 1, 
                        avatar_type: 1
                    } 
                },
                {
                    $group : {
                        _id : "$hour",
                        accesses : {$push:"$$ROOT"},
                    }
                },
                {
                    $sort: {_id:1}
                }
            ])
        } 
        else if(req.query.type === 'todayAttendance') {
            get_data = await api_v1_person_access.aggregate([
                {
                    $match: {
                        access_time : {$regex:today},
                        avatar_type : 1
                    }
                },
                {
                    $sort: {
                        lastDate : -1
                    }   
                },
                {
                    $group: {
                        _id: {"user_obid":"$user_obid","avatar_type":"$avatar_type"},
                        access_time : {$first:'$access_time'},
                        count: { $sum: 1 }
                    },
                },
            ])
        } else if(req.query.type === 'temperature') {
            get_data = await api_v1_person_access.find()
                .where('avatar_temperature')
                .sort('-access_time')
                .select('access_time avatar_file_url avatar_temperature avatar_type name')
                .limit(5)
        } else if(req.query.type === 'attendance') {
            get_data = await api_v1_person_access.aggregate([
                {
                    $match: {avatar_type : 1}
                },
                {
                    $project : {avatar_file:0,avatar_file_checksum: 0},
                },
                {
                    $sort: {avatar_contraction_data : 1,access_time : 1}   
                },
            ])
        } else {
            get_data = await api_v1_person_access.find().select('-avatar_file')
        }
        res.send(get_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_person_access.findById(id)
        res.send(get_single_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v1_person_access(req.body)
        res.send(add.save())
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await api_v1_person_access.findByIdAndUpdate(id, update_data, {new: true })
        return update
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_person_access.findByIdAndRemove(id)
        res.dend(delete_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

//외래키인 resolve
// exports.getapi_v1_person_access_depend_on_user = async (req, reply) => {
//     try {
//         const id = req.params === undefined ? req.id : req.params.id
//         const depend_on_data = await api_v1_person_access.find({ reception_user_id : id })
//         return depend_on_data
//     }catch (err) {
//         throw boom.boomify(err)
//     }
// }
 
module.exports = router;