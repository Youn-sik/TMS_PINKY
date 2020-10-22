var express = require('express');
var router = express.Router();
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const boom = require('boom')
const api_v1_person_access = require('../../../../models/api/v1/person/access')
const Statistics = require('../../../../models/api/v3/device/statistics')
const StatisticsTemp = require('../../../../models/api/v3/device/statistics_temp')
const fs = require('fs')

router.get('/',async function(req, res) {
    try {
        // access_time : { $gte:week[0],$lte: week[1] }

        let get_data;
        let date = new RegExp(moment().format('YYYY-MM-DD'));
        let today = new RegExp(moment().format('YYYY-MM-DD'));
        let week = [moment().subtract(6, 'days').format('YYYY-MM-DD')+" 00:00:00",moment().format('YYYY-MM-DD')+" 23:59:59"]
        if(req.query.type === 'todayStatistics') {
            employee = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 1,
                        access_time : {$regex:date}
                    }
                },
                {
                    $count: 'count'
                },
            ]).allowDiskUse(true);

            black = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 4,
                        access_time : {$regex:date}
                    }
                },
                {
                    $count: 'count'
                },
            ]).allowDiskUse(true);

            stranger = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 3,
                        access_time : {$regex:date}
                    }
                },
                {
                    $count: 'count'
                },
            ]).allowDiskUse(true);

            get_data = [
                {
                    _id : {
                        type : 1
                    },
                    count : employee.length > 0 ? employee[0].count : 0,
                },
                {
                    _id : {
                        type : 3
                    },
                    count : stranger.length > 0 ? stranger[0].count : 0,
                },
                {
                    _id : {
                        type : 4
                    },
                    count : black.length > 0 ? black[0].count : 0,
                },
            ]

        } else if(req.query.type === 'weekStatistics') {
            employee = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 1,
                        access_time : { $gte:week[0],$lte: week[1] }
                    }
                },
                {
                    $count: 'count'
                },
            ]).allowDiskUse(true);

            black = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 4,
                        access_time : { $gte:week[0],$lte: week[1] }
                    }
                },
                {
                    $count: 'count'
                },
            ]).allowDiskUse(true);

            stranger = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 3,
                        access_time : { $gte:week[0],$lte: week[1] }
                    }
                },
                {
                    $count: 'count'
                },
            ]).allowDiskUse(true);

            get_data = [
                {
                    _id : {
                        type : 1
                    },
                    count : employee.length > 0 ? employee[0].count : 0,
                },
                {
                    _id : {
                        type : 3
                    },
                    count : stranger.length > 0 ? stranger[0].count : 0,
                },
                {
                    _id : {
                        type : 4
                    },
                    count : black.length > 0 ? black[0].count : 0,
                },
            ]
        } else if(req.query.type === 'deviceStats') {
            let date = req.query.date.split('/');
            let device = new RegExp("^"+req.query.device+"$");

            if(device === '')
                device = new RegExp('')

            get_data = await api_v1_person_access.aggregate([
                {
                    $match: {
                        access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                        stb_sn : {$regex : device}
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
                {
                    $sort:{
                        "_id.date":1
                    }
                },
            ]).allowDiskUse(true);
        } else if(req.query.type === 'deviceGroupAccesses') {
            let date = req.query.date.split('/');
            let device = req.query.device === 'all' ? null : req.query.device;
            get_data = {
                access : await Statistics.find().regex(access_date , new RegExp(date[0])),
                temp : await Statistics_temp.find().regex(access_date , new RegExp(date[0])),
            }
            
            // aggregate([
            //     {
            //         $match: {
            //             access_time : { $regex: new RegExp(date[0])},
            //             stb_sn : device 
            //         }
            //     },
            // ])
            // if(device) {
            //     get_data = await api_v1_person_access.aggregate([
            //         {
            //             $match: {
            //                 access_time : { $regex: new RegExp(date[0])},
            //                 stb_sn : device 
            //             }
            //         },
            //         {
            //             $sort:{avatar_temperature:-1}
            //         },
            //         { 
            //             $project : { 
            //                 date_time : { 
            //                     $split: ["$access_time", " "] 
            //                 },
            //                 stb_sn:"$stb_sn",
            //                 avatar_temperature : "$avatar_temperature", 
            //                 avatar_file_url : "$avatar_file_url", 
            //                 name : "$name",
            //                 avatar_type : "$avatar_type"
            //             } 
            //         },
            //         {
            //             $project : {
            //                 date : {$arrayElemAt:["$date_time",0]},
            //                 time : {$arrayElemAt:["$date_time",1]},
            //                 stb_sn : 1,
            //                 avatar_temperature : 1,
            //                 avatar_file_url : 1,
            //                 name : 1, 
            //                 avatar_type: 1
            //             }
            //         },
            //         { 
            //             $project : { 
            //                 timeArr : { 
            //                     $split: ["$time", ":"] 
            //                 },
            //                 date : 1,
            //                 stb_sn : 1,
            //                 avatar_temperature : 1,
            //                 avatar_file_url : 1,
            //                 name : 1, 
            //                 avatar_type: 1
            //             } 
            //         },
            //         { 
            //             $project : { 
            //                 hour :  {
            //                     $arrayElemAt:["$timeArr",0]
            //                 },
            //                 date : 1,
            //                 stb_sn : 1,
            //                 avatar_temperature : 1,
            //                 avatar_file_url : 1,
            //                 name : 1, 
            //                 avatar_type: 1
            //             } 
            //         },
            //         {
            //             $group : {
            //                 _id : "$hour",
            //                 count: { $sum: 1 },
            //                 maxTemp:{ $first: "$avatar_temperature" },
            //                 maxUrl:{ $first: "$avatar_file_url" },
            //                 maxType:{ $first: "$avatar_type" },
            //             }
            //         },
            //         {
            //             $sort: {_id:1}
            //         }
            //     ]).allowDiskUse(true);
            // } else {         
            //     get_data = await api_v1_person_access.aggregate([
            //         {
            //             $match: {
            //                 access_time : { $regex: new RegExp(date[0])},
            //             }
            //         },
            //         { 
            //             $project : { 
            //                 date_time : { 
            //                     $split: ["$access_time", " "] 
            //                 },
            //                 stb_sn:"$stb_sn",
            //                 avatar_temperature : "$avatar_temperature", 
            //                 avatar_file_url : "$avatar_file_url", 
            //                 name : "$name",
            //                 avatar_type : "$avatar_type"
            //             } 
            //         },
            //         {
            //             $project : {
            //                 date : {$arrayElemAt:["$date_time",0]},
            //                 time : {$arrayElemAt:["$date_time",1]},
            //                 stb_sn : 1,
            //                 avatar_temperature : 1,
            //                 avatar_file_url : 1,
            //                 name : 1, 
            //                 avatar_type: 1
            //             }
            //         },
            //         { 
            //             $project : { 
            //                 timeArr : { 
            //                     $split: ["$time", ":"] 
            //                 },
            //                 date : 1,
            //                 stb_sn : 1,
            //                 avatar_temperature : 1,
            //                 avatar_file_url : 1,
            //                 name : 1, 
            //                 avatar_type: 1
            //             } 
            //         },
            //         { 
            //             $project : { 
            //                 hour :  {
            //                     $arrayElemAt:["$timeArr",0]
            //                 },
            //                 date : 1,
            //                 stb_sn : 1,
            //                 avatar_temperature : 1,
            //                 avatar_file_url : 1,
            //                 name : 1, 
            //                 avatar_type: 1
            //             } 
            //         },
            //         {
            //             $sort:{avatar_temperature:-1}
            //         },
            //         {
            //             $group : {
            //                 _id : "$hour",
            //                 count: { $sum: 1 },
            //                 maxTemp:{ $first: "$avatar_temperature" },
            //                 maxUrl:{ $first: "$avatar_file_url" },
            //                 maxType:{ $first: "$avatar_type" },
            //             }
            //         },
            //         {
            //             $sort: {_id:1}
            //         }
            //     ]).allowDiskUse(true);
            // }
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
            ]).allowDiskUse(true);
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
            ]).allowDiskUse(true);
        } else if(req.query.type === 'dateCount') {
            let date = req.query.date.split('/');
            let search = new RegExp('');
            let avatar_type = parseInt(req.query.avatar_type);
            let tempType = req.query.tempType;
            let avatar_temperature = req.query.avatar_temperature;
            let stb_sn = '';
            let stb_name = '';
            let stb_location = '';
            let name = ''
            
            if(req.query.searchType === 'name') {
                name = search
            } else if(req.query.searchType === 'stb_name') {
                stb_name = search
            } else if(req.query.searchType === 'stb_location') {
                stb_location = search
            } else if(req.query.searchType === 'stb_sn') {
                stb_sn = search
            }

            if(avatar_type && avatar_temperature && tempType) { //온도,타입 모두 설정한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                                name : { $regex:new RegExp(name) },
                                stb_sn : { $regex:new RegExp(stb_sn) },
                                stb_name : { $regex:new RegExp(stb_name) },
                                stb_location : { $regex:new RegExp(stb_location) },
                                avatar_type : avatar_type,
                                avatar_temperature : { $gte: avatar_temperature }
                            }
                        },
                        {
                            $count : 'count'
                        }
                    ]).allowDiskUse(true);
                } else {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                                name : { $regex:new RegExp(name) },
                                stb_sn : { $regex:new RegExp(stb_sn) },
                                stb_name : { $regex:new RegExp(stb_name) },
                                stb_location : { $regex:new RegExp(stb_location) },
                                avatar_type : avatar_type,
                                avatar_temperature : { $lt: avatar_temperature }
                            }
                        },
                        {
                            $count : 'count'
                        }
                    ]).allowDiskUse(true);
                }
            } else if (avatar_type) { //아바타 타입만 선택한 경우
                get_data = await api_v1_person_access.aggregate([
                    {
                        $match: {
                            access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                            name : { $regex:new RegExp(name) },
                            stb_sn : { $regex:new RegExp(stb_sn) },
                            stb_name : { $regex:new RegExp(stb_name) },
                            stb_location : { $regex:new RegExp(stb_location) },
                            avatar_type : avatar_type,
                        }
                    },
                    {
                        $count : 'count'
                    }
                ]).allowDiskUse(true);
            } else if (avatar_temperature && tempType) {//온도 타입만 선택한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                                name : { $regex:new RegExp(name) },
                                stb_sn : { $regex:new RegExp(stb_sn) },
                                stb_name : { $regex:new RegExp(stb_name) },
                                stb_location : { $regex:new RegExp(stb_location) },
                                avatar_temperature : { $gte: avatar_temperature }
                            }
                        },
                        {
                            $count : 'count'
                        }
                    ]).allowDiskUse(true);
                } else {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                                name : { $regex:new RegExp(name) },
                                stb_sn : { $regex:new RegExp(stb_sn) },
                                stb_name : { $regex:new RegExp(stb_name) },
                                stb_location : { $regex:new RegExp(stb_location) },
                                avatar_temperature : { $lt: avatar_temperature }
                            }
                        },
                        {
                            $count : 'count'
                        }
                    ]).allowDiskUse(true);
                }   
            } else { //모두 전체일경우
                get_data = await api_v1_person_access.aggregate([
                    {
                        $match: {
                            access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                            name : { $regex:new RegExp(name) },
                            stb_sn : { $regex:new RegExp(stb_sn) },
                            stb_name : { $regex:new RegExp(stb_name) },
                            stb_location : { $regex:new RegExp(stb_location) },
                        }
                    },
                    {
                        $count : 'count'
                    }
                ]).allowDiskUse(true);
            }
        } else {
            // $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"
            let date = req.query.date.split('/');
            let page = req.query.page - 1;
            let avatar_type = parseInt(req.query.avatar_type);
            let rowPerPage = parseInt(req.query.rowsPerPage);
            let tempType = req.query.tempType;
            let avatar_temperature = req.query.avatar_temperature;
            let headerType = "-_id";
            let search = '';
            let name = ''
            let stb_sn = '';
            let stb_name = '';
            let stb_location = ''

            if(req.query.search) 
                search = new RegExp(req.query.search)

            if(req.query.headerType)
                headerType = req.query.headerType

            if(req.query.name)
                name = req.query.name

            if(req.query.searchType === 'stb_name') {
                stb_name = search
            } else if(req.query.searchType === 'stb_location') {
                stb_location = search
            } else if(req.query.searchType === 'stb_sn') {
                stb_sn = search
            }

            if(req.query.execPage) {
                page = parseInt(req.query.execPage) - 1
                rowPerPage = parseInt(req.query.execRowPerPage)
            }

            if(avatar_type && avatar_temperature && tempType) { //온도,타입 모두 설정한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .select(req.query.execPage ? '-avatar_file' : '')
                    .where("avatar_type").equals(avatar_type)
                    .gte('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0]+" 00:00:00")
                    .lte("access_time",date[1]+" 23:59:59")
                    .regex("stb_sn",new RegExp(stb_sn))
                    .regex("name",new RegExp(name))
                    .regex("stb_name",new RegExp(stb_name))
                    .regex("stb_location",new RegExp(stb_location))
                    .skip(page*rowPerPage)
                    .limit(rowPerPage)
                } else {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .select(req.query.execPage ? '-avatar_file' : '')
                    .where("avatar_type").equals(avatar_type)
                    .lt('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0]+" 00:00:00")
                    .lte("access_time",date[1]+" 23:59:59")
                    .regex("stb_sn",new RegExp(stb_sn))
                    .regex("name",new RegExp(name))
                    .regex("stb_name",new RegExp(stb_name))
                    .regex("stb_location",new RegExp(stb_location))
                    .skip(page*rowPerPage)
                    .limit(rowPerPage)
                }
            } else if (avatar_type) { //아바타 타입만 선택한 경우
                get_data = await api_v1_person_access.find()
                .sort(headerType)
                .select(req.query.execPage ? '-avatar_file' : '')
                .where("avatar_type").equals(avatar_type)
                .gte("access_time",date[0]+" 00:00:00")
                .lte("access_time",date[1]+" 23:59:59")
                .regex("stb_sn",new RegExp(stb_sn))
                .regex("stb_name",new RegExp(stb_name))
                .regex("stb_location",new RegExp(stb_location))
                .regex("name",new RegExp(name))
                .skip(page*rowPerPage)
                .limit(rowPerPage)
            } else if (avatar_temperature && tempType) {//온도 타입만 선택한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .select(req.query.execPage ? '-avatar_file' : '')
                    .gte('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0]+" 00:00:00")
                    .lte("access_time",date[1]+" 23:59:59")
                    .regex("stb_sn",new RegExp(stb_sn))
                    .regex("name",new RegExp(name))
                    .regex("stb_name",new RegExp(stb_name))
                    .regex("stb_location",new RegExp(stb_location))
                    .skip(page*rowPerPage)
                    .limit(rowPerPage)
                } else {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .select(req.query.execPage ? '-avatar_file' : '')
                    .lt('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0]+" 00:00:00")
                    .lte("access_time",date[1]+" 23:59:59")
                    .regex("stb_sn",new RegExp(stb_sn))
                    .regex("stb_name",new RegExp(stb_name))
                    .regex("stb_location",new RegExp(stb_location))
                    .regex("name",new RegExp(name))
                    .skip(page*rowPerPage)
                    .limit(rowPerPage)
                }   
            }else { //모두 전체일경우
                get_data = await api_v1_person_access.find()
                .select(req.query.execPage ? '-avatar_file' : '')
                .sort(headerType)
                .gte("access_time",date[0]+" 00:00:00")
                .lte("access_time",date[1]+" 23:59:59")
                .regex("stb_sn",new RegExp(stb_sn))
                .regex("stb_name",new RegExp(stb_name))
                .regex("stb_location",new RegExp(stb_location))
                .regex("name",new RegExp(name))
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
        let ids = req.body.accesses_data.map(i => i._id)
        const delete_data = await api_v1_person_access.deleteMany({
            _id:{
                $in:ids
            }
        })
        req.body.accesses_data.map(access => {
            let ip = access.avatar_file_url.split(':3000')[0]
            fs.unlink(access.avatar_file_url.replace(ip+':3000/','/var/www/backend/'),() => {})
        })
        res.send('delete_data')
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