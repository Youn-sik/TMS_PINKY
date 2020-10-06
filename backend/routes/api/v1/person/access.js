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
        if(req.query.type === 'todayStatistics') {
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
        } else if(req.query.type === 'deviceStats') {
            let date = req.query.date.split('/');
            let device = req.query.device;
            get_data = await api_v1_person_access.aggregate([
                {
                    $match: {
                        access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                        stb_sn : device
                    }
                },
                { 
                    $project : { 
                        date_time : { 
                            $split: ["$access_time", " "] 
                        },
                        avatar_type : 1
                    } 
                },
                {
                    $project : {
                        date : {$arrayElemAt:["$date_time",0]},
                        avatar_type : 1
                    }
                },
                {
                    $group : {
                        _id : {
                            avatar_type:"$avatar_type",
                            date:"$date"
                        },
                        count: { $sum: 1 },
                    }
                },
            ])
        } else if(req.query.type === 'deviceGroupAccesses') {
            let date = req.query.date.split('/');
            let device = req.query.device;

            if(device) {
                get_data = await api_v1_person_access.aggregate([
                    {
                        $sort:{"avatar_temperature" : -1}
                    },
                    {
                        $match: {
                            access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                            stb_sn : device 
                        }
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
                            count: { $sum: 1 },
                            maxTemp:{ $max: "$avatar_temperature" },
                            maxTempPicture:{ $max: "$avatar_file_url" },
                            avatar_type : "$avatar_type"
                        }
                    },
                    {
                        $sort: {_id:1}
                    }
                ])
            } else {         
                get_data = await api_v1_person_access.aggregate([
                    {
                        $sort:{"avatar_temperature" : -1}
                    },
                    {
                        $match: {
                            access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" }
                        }
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
                        $sort:{avatar_temperature:-1}
                    },
                    {
                        $group : {
                            _id : "$hour",
                            count: { $sum: 1 },
                            maxTemp:{ $first: "$avatar_temperature" },
                            maxUrl:{ $first: "$avatar_file_url" },
                            maxType:{ $first: "$avatar_type" },
                        }
                    },
                    {
                        $sort: {_id:1}
                    }
                ])
            }
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
        } else if(req.query.type === 'dateCount') {
            let date = req.query.date.split('/');
            let search = '';
            let avatar_type = req.query.avatar_type;
            let tempType = req.query.tempType;
            let avatar_temperature = req.query.avatar_temperature;

            if(req.query.search) 
                search = req.query.search;
            
            if(avatar_type && avatar_temperature && tempType) { //온도,타입 모두 설정한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                                stb_sn : { $regex:search },
                                avatar_type : parseInt(avatar_type),
                                avatar_temperature : { $gte: avatar_temperature }
                            }
                        },
                        {
                            $group: {
                                _id: {"type":"$avatar_contraction_data"},
                                count: { $sum: 1 }
                            }
                        }
                    ])
                } else {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                                stb_sn : { $regex:search },
                                avatar_type : parseInt(avatar_type),
                                avatar_temperature : { $lt: avatar_temperature }
                            }
                        },
                        {
                            $group: {
                                _id: {"type":"$avatar_contraction_data"},
                                count: { $sum: 1 }
                            }
                        }
                    ])
                }
            } else if (avatar_type) { //아바타 타입만 선택한 경우
                get_data = await api_v1_person_access.aggregate([
                    {
                        $match: {
                            access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                            stb_sn : { $regex:search },
                            avatar_type : parseInt(avatar_type),
                        }
                    },
                    {
                        $group: {
                            _id: {"type":"$avatar_contraction_data"},
                            count: { $sum: 1 }
                        }
                    }
                ])
            } else if (avatar_temperature && tempType) {//온도 타입만 선택한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                                stb_sn : { $regex:search },
                                avatar_temperature : { $gte: avatar_temperature }
                            }
                        },
                        {
                            $group: {
                                _id: {"type":"$avatar_contraction_data"},
                                count: { $sum: 1 }
                            }
                        }
                    ])
                } else {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                                stb_sn : { $regex:search },
                                avatar_temperature : { $lt: avatar_temperature }
                            }
                        },
                        {
                            $group: {
                                _id: {"type":"$avatar_contraction_data"},
                                count: { $sum: 1 }
                            }
                        }
                    ])
                }   
            } else { //모두 전체일경우
                get_data = await api_v1_person_access.aggregate([
                    {
                        $match: {
                            access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                            stb_sn : { $regex:search },
                        }
                    },
                    {
                        $group: {
                            _id: {"type":"$avatar_type"},
                            count: { $sum: 1 }
                        }
                    }
                ])
            }
        } else {
            // $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"
            let date = req.query.date.split('/');
            let page = req.query.page - 1;
            let avatar_type = req.query.avatar_type;
            let tempType = req.query.tempType;
            let avatar_temperature = req.query.avatar_temperature;
            let headerType = "-_id";
            let rowPerPage = 7;
            let search = '';

            if(req.query.search) 
                search = req.query.search;

            if(req.query.headerType)
                headerType = req.query.headerType

            if(avatar_type && avatar_temperature && tempType) { //온도,타입 모두 설정한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .select('-avatar_file')
                    .where("avatar_type").equals(parseInt(avatar_type))
                    .gte('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0]+" 00:00:00")
                    .lte("access_time",date[1]+" 23:59:59")
                    .regex("stb_sn",new RegExp(search))
                    .skip(page*rowPerPage)
                    .limit(rowPerPage)
                } else {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .select('-avatar_file')
                    .where("avatar_type").equals(parseInt(avatar_type))
                    .lt('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0]+" 00:00:00")
                    .lte("access_time",date[1]+" 23:59:59")
                    .regex("stb_sn",new RegExp(search))
                    .skip(page*rowPerPage)
                    .limit(rowPerPage)
                }
            } else if (avatar_type) { //아바타 타입만 선택한 경우
                get_data = await api_v1_person_access.find()
                .sort(headerType)
                .select('-avatar_file')
                .where("avatar_type").equals(parseInt(avatar_type))
                .gte("access_time",date[0]+" 00:00:00")
                .lte("access_time",date[1]+" 23:59:59")
                .regex("stb_sn",new RegExp(search))
                .skip(page*rowPerPage)
                .limit(rowPerPage)
            } else if (avatar_temperature && tempType) {//온도 타입만 선택한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .select('-avatar_file')
                    .gte('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0]+" 00:00:00")
                    .lte("access_time",date[1]+" 23:59:59")
                    .regex("stb_sn",new RegExp(search))
                    .skip(page*rowPerPage)
                    .limit(rowPerPage)
                } else {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .select('-avatar_file')
                    .lt('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0]+" 00:00:00")
                    .lte("access_time",date[1]+" 23:59:59")
                    .regex("stb_sn",new RegExp(search))
                    .skip(page*rowPerPage)
                    .limit(rowPerPage)
                }   
            }else { //모두 전체일경우
                get_data = await api_v1_person_access.find()
                .sort(headerType)
                .select('-avatar_file')
                .gte("access_time",date[0]+" 00:00:00")
                .lte("access_time",date[1]+" 23:59:59")
                .regex("stb_sn",new RegExp(search))
                .skip(page*rowPerPage)
                .limit(rowPerPage)
            }
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

router.delete('/',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_person_access.remove({ access_time: { $lt: req.body.date } })
        res.send(delete_data)
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