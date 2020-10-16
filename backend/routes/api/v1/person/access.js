var express = require('express');
var router = express.Router();
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const boom = require('boom')
const api_v1_person_access = require('../../../../models/api/v1/person/access')
const fs = require('fs')
router.get('/',async function(req, res) {
    try {
        let get_data;
        let date = new RegExp(moment().format('YYYY-MM-DD'));
        let today = new RegExp(moment().format('YYYY-MM-DD'));
        let week = [moment().subtract(6, 'days').format('YYYY-MM-DD')+" 23:59:59",moment().format('YYYY-MM-DD')+" 00:00:00"]
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
            ]).allowDiskUse(true);
        } else if(req.query.type === 'weekStatistics') {
            get_data = await api_v1_person_access.aggregate([
                {
                    $match: {
                        access_time : { $gte:week[0],$lte: week[1] }
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
            ]).allowDiskUse(true);
        } else if(req.query.type === 'deviceStats') {
            let date = req.query.date.split('/');
            let device = req.query.device === ' ' ? new RegExp('') : new RegExp("^"+req.query.device+"$");
            let tempLimit = req.query.tempLimit
            get_data = await api_v1_person_access.aggregate([
                {
                    $match: {
                        access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                        stb_sn : {$regex:device}
                    }
                },
                { 
                    $project : { 
                        date_time : { 
                            $split: ["$access_time", " "] 
                        },
                        temp_status : { 
                            $cond: {
                                if: {
                                    $gte: ["$avatar_temperature" , tempLimit]
                                },
                                then: 'abnormal',
                                else: 'normal'
                            }
                        },
                    } 
                },
                {
                    $project : {
                        date : {$arrayElemAt:["$date_time",0]},
                        temp_status: 1,
                    }
                },
                {
                    $group : {
                        _id : {
                            temp_status:"$temp_status",
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

            if(device) {
                get_data = await api_v1_person_access.aggregate([
                    {
                        $match: {
                            access_time : { $regex: new RegExp(date[0])},
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
                            avatar_file : "$avatar_file", 
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
                            avatar_file : 1,
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
                            avatar_file : 1,
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
                            avatar_file : 1,
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
                            maxBase64:{ $first: "$avatar_file" },
                            maxType:{ $first: "$avatar_type" },
                        }
                    },
                    {
                        $sort: {_id:1}
                    }
                ]).allowDiskUse(true);
            } else {         
                get_data = await api_v1_person_access.aggregate([
                    {
                        $match: {
                            access_time : { $regex: new RegExp(date[0])},
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
                            avatar_file : "$avatar_file", 
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
                            avatar_file : 1,
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
                            avatar_file : 1,
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
                            avatar_file : 1,
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
                            maxBase64:{ $first: "$avatar_file" },
                            maxType:{ $first: "$avatar_type" },
                        }
                    },
                    {
                        $sort: {_id:1}
                    }
                ]).allowDiskUse(true);
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
            let search = '';
            let selected_temp_chk = false;
            let tempType = req.query.tempType;
            let avatar_temperature = req.query.avatar_temperature;
            let selected_temp = req.query.avatar_temp;

            if(selected_temp !== ' ') {
                selected_temp_chk = true
                selected_temp = new RegExp(selected_temp+'\\.');
            }
            else
                selected_temp = new RegExp("")

            if(req.query.search) 
                search = req.query.search;
            
            if(selected_temp_chk && avatar_temperature && tempType) { //온도,타입 모두 설정한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0],$lte: date[1] },
                                stb_sn : { $regex:search },
                                avatar_temperature : { $gte: avatar_temperature },
                                avatar_temperature : { $regex:selected_temp },
                            }
                        },
                        {
                            $group: {
                                _id: {"type":"$avatar_contraction_data"},
                                count: { $sum: 1 }
                            }
                        }
                    ]).allowDiskUse(true);
                } else {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0],$lte: date[1]},
                                stb_sn : { $regex:search },
                                avatar_temperature : { $lt: avatar_temperature },
                                avatar_temperature : { $regex:selected_temp },
                            }
                        },
                        {
                            $group: {
                                _id: {"type":"$avatar_contraction_data"},
                                count: { $sum: 1 }
                            }
                        }
                    ]).allowDiskUse(true);
                }
            } else if (selected_temp_chk) { //아바타 타입만 선택한 경우
                get_data = await api_v1_person_access.aggregate([
                    {
                        $match: {
                            access_time : { $gte:date[0],$lte: date[1] },
                            stb_sn : { $regex:search },
                            avatar_temperature : { $regex:selected_temp },
                        }
                    },
                    {
                        $group: {
                            _id: {"type":"$avatar_contraction_data"},
                            count: { $sum: 1 }
                        }
                    }
                ]).allowDiskUse(true);
            } else if (avatar_temperature && tempType) {//온도 타입만 선택한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0],$lte: date[1] },
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
                    ]).allowDiskUse(true);
                } else {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0],$lte: date[1] },
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
                    ]).allowDiskUse(true);
                }   
            } else { //모두 전체일경우
                get_data = await api_v1_person_access.aggregate([
                    {
                        $match: {
                            access_time : { $gte:date[0],$lte: date[1] },
                            stb_sn : { $regex:search },
                        }
                    },
                    {
                        $group: {
                            _id: {"type":"$avatar_type"},
                            count: { $sum: 1 }
                        }
                    }
                ]).allowDiskUse(true);
            }
        } else {
            // $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"
            let date = req.query.date.split('/');
            let page = req.query.page - 1;
            let avatar_type = req.query.avatar_type;
            let tempType = req.query.tempType;
            let avatar_temperature = req.query.avatar_temperature;
            let headerType = "-_id";
            let rowsPerPage = parseInt(req.query.rowsPerPage);
            let selected_temp = req.query.avatar_temp;
            let selected_temp_chk = false;
            let search = '';
            let name = ''
            let stb_sn = '';
            let stb_name = '';
            let stb_location = ''

            if(selected_temp !== ' ') {
                selected_temp_chk = true
                selected_temp = new RegExp(selected_temp+'\\.');
            }
            else
                selected_temp = new RegExp('');

            if(req.query.search) 
                search = new RegExp(req.query.search)

            if(req.query.headerType)
                headerType = req.query.headerType

            if(req.query.name)
                name = req.query.name

            if(req.query.searchType === 'all') {
                stb_sn = stb_name = stb_location = search
            } else if(req.query.searchType === 'stb_name') {
                stb_name = search
            } else if(req.query.searchType === 'stb_location') {
                stb_location = search
            } else if(req.query.searchType === 'stb_sn') {
                stb_sn = search
            }

            if(selected_temp_chk && avatar_temperature && tempType) { //온도,아바타 온도 모두 설정한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    
                    .gte('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0])
                    .regex("avatar_temperature",selected_temp)
                    .lte("access_time",date[1])
                    .regex("stb_sn",stb_sn)
                    // .regex("stb_name",stb_name)
                    // .regex("stb_location",stb_location)
                    .skip(page*rowsPerPage)
                    .limit(rowsPerPage)
                } else {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .lt('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0])
                    .regex("avatar_temperature",selected_temp)
                    .lte("access_time",date[1])
                    .regex("stb_sn",stb_sn)
                    // .regex("stb_name",stb_name)
                    // .regex("stb_location",stb_location)
                    .skip(page*rowsPerPage)
                    .limit(rowsPerPage)
                }
            } else if (selected_temp_chk) { //아바타 온도만 선택한 경우
                get_data = await api_v1_person_access.find()
                .sort(headerType)
                .gte("access_time",date[0])
                .lte("access_time",date[1])
                .regex("avatar_temperature",selected_temp)
                .regex("stb_sn",stb_sn)
                // .regex("stb_name",stb_name)
                // .regex("stb_location",stb_location)
                .skip(page*rowsPerPage)
                .limit(rowsPerPage)
            } else if (avatar_temperature && tempType) {//온도 타입만 선택한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .gte('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0])
                    .lte("access_time",date[1])
                    .regex("stb_sn",stb_sn)
                    // .regex("stb_name",stb_name)
                    // .regex("stb_location",stb_location)
                    .skip(page*rowsPerPage)
                    .limit(rowsPerPage)
                } else {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .lt('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0])
                    .lte("access_time",date[1])
                    .regex("stb_sn",stb_sn)
                    // .regex("stb_name",stb_name)
                    // .regex("stb_location",stb_location)
                    .skip(page*rowsPerPage)
                    .limit(rowsPerPage)
                }   
            }else { //모두 전체일경우
                get_data = await api_v1_person_access.find()
                .sort(headerType)
                .gte("access_time",date[0])
                .lte("access_time",date[1])
                .regex("stb_sn",stb_sn)
                // .regex("stb_name",stb_name)
                // .regex("stb_location",stb_location)
                .skip(page*rowsPerPage)
                .limit(rowsPerPage)
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
            let ip = access.avatar_file_url.split(':')[0]
            fs.unlink(access.avatar_file_url.replace(ip+':3000/','/var/www/backend/'),() => {})
        })
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