var express = require('express');
var router = express.Router();
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const boom = require('boom')
const api_v1_person_access = require('../../../../models/api/v1/person/access')
const Statistics = require('../../../../models/api/v3/device/statistics')
const StatisticsTemp = require('../../../../models/api/v3/device/statistics_temp')
const imageToBase64 = require('image-to-base64');
const fs = require('fs')
router.get('/',async function(req, res) {
    try {
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
            let device = req.query.device

            if(device === '')
                device = new RegExp('')
            else
                device = new RegExp("^"+req.query.device+"$");
            
            get_data = await Statistics.find()
            .gte("access_date",date[0])
            .lte("access_date",date[1])
            .regex('serial_number', device)
        } else if(req.query.type === 'deviceGroupAccesses') {
            let date = req.query.date.split('/');
            let device = req.query.device
            
            if(device === 'all') {
                get_data = {
                    access : await Statistics.find()
                    .regex('access_date' , date[0]),
                    temp : await StatisticsTemp.find()
                    .regex('access_date' , date[0])
                }
            } else {
                get_data = {
                    access : await Statistics.find()
                    .regex('access_date' , date[0])
                    .where('serial_number' ,device),
                    temp : await StatisticsTemp.find()
                    .regex('access_date' , date[0])
                    .where('serial_number' ,device)
                }
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
            let search = req.query.search;
            let selected_temp_chk = false;
            let tempType = req.query.tempType;
            let avatar_temperature = req.query.avatar_temperature;
            let selected_temp = req.query.avatar_temp;
            let stb_sn = new RegExp('');
            let stb_name = new RegExp('');
            let stb_location = new RegExp('');

            if(selected_temp !== ' ') {
                selected_temp_chk = true
                selected_temp = new RegExp(selected_temp+'\\.');
            }
            else
                selected_temp = new RegExp("")

            if(req.query.searchType === 'stb_name') {
                stb_name = new RegExp(search)
            } else if(req.query.searchType === 'stb_location') {
                stb_location = new RegExp(search)
            } else if(req.query.searchType === 'stb_sn') {
                stb_sn = new RegExp(search)
            }
            
            if(selected_temp_chk && avatar_temperature && tempType) { //온도,타입 모두 설정한 경우
                if(tempType === '2') {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0],$lte: date[1] },
                                stb_sn : { $regex:stb_sn },
                                stb_location : { $regex:stb_location },
                                stb_name : { $regex:stb_name },
                                avatar_temperature : { $gte: avatar_temperature },
                                avatar_temperature : { $regex:selected_temp },
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
                                access_time : { $gte:date[0],$lte: date[1]},
                                stb_sn : { $regex:stb_sn },
                                stb_location : { $regex:stb_location },
                                stb_name : { $regex:stb_name },
                                avatar_temperature : { $lt: avatar_temperature },
                                avatar_temperature : { $regex:selected_temp },
                            }
                        },
                        {
                            $count : 'count'
                        }
                    ]).allowDiskUse(true);
                }
            } else if (selected_temp_chk) { //아바타 타입만 선택한 경우
                get_data = await api_v1_person_access.aggregate([
                    {
                        $match: {
                            access_time : { $gte:date[0],$lte: date[1] },
                            stb_sn : { $regex:stb_sn },
                            stb_location : { $regex:stb_location },
                            stb_name : { $regex:stb_name },
                            avatar_temperature : { $regex:selected_temp },
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
                                access_time : { $gte:date[0],$lte: date[1] },
                                stb_sn : { $regex:stb_sn },
                                stb_location : { $regex:stb_location },
                                stb_name : { $regex:stb_name },
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
                                access_time : { $gte:date[0],$lte: date[1] },
                                stb_sn : { $regex:stb_sn },
                                stb_location : { $regex:stb_location },
                                stb_name : { $regex:stb_name },
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
                            access_time : { $gte:date[0],$lte: date[1] },
                            stb_sn : { $regex:stb_sn },
                            stb_location : { $regex:stb_location },
                            stb_name : { $regex:stb_name },
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
                    .regex("stb_name",stb_name)
                    .regex("stb_location",stb_location)
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
                    .regex("stb_name",stb_name)
                    .regex("stb_location",stb_location)
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
                .regex("stb_name",stb_name)
                .regex("stb_location",stb_location)
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
                    .regex("stb_name",stb_name)
                    .regex("stb_location",stb_location)
                    .skip(page*rowsPerPage)
                    .limit(rowsPerPage)
                } else {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
                    .lt('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0])
                    .lte("access_time",date[1])
                    .regex("stb_sn",stb_sn)
                    .regex("stb_name",stb_name)
                    .regex("stb_location",stb_location)
                    .skip(page*rowsPerPage)
                    .limit(rowsPerPage)
                }   
            }else { //모두 전체일경우
                get_data = await api_v1_person_access.find()
                .sort(headerType)
                .gte("access_time",date[0])
                .lte("access_time",date[1])
                .regex("stb_sn",stb_sn)
                .regex("stb_name",stb_name)
                .regex("stb_location",stb_location)
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
        let delete_data;
        if(req.query.type === 'all') {
            let searchType = req.query.searchType
            let date = req.query.date.split('/');
            let search = new RegExp(req.query.search)
            let avatarTemp = req.query.avatar_temp === ' ' ? new RegExp('') : new RegExp(req.query.avatar_temp)
            let tempType = req.query.tempType === '0' ? {$gte : '0'} :
                            req.query.tempType === '1' ? {$lt : req.query.avatar_temperature} :  {$gte : req.query.avatar_temperature}

            if(searchType === 'stb_name') {
                delete_data = await api_v1_person_access.deleteMany({
                    access_time : { $gte:date[0],$lte: date[1] },
                    stb_name : search,
                    $and:[
                        {avatar_temperature : tempType},
                        {avatar_temperature : avatarTemp}
                    ]
                })
            } else if(searchType === 'stb_location'){
                delete_data = await api_v1_person_access.deleteMany({
                    access_time : { $gte:date[0],$lte: date[1] },
                    stb_location : search,
                    $and:[
                        {avatar_temperature : tempType},
                        {avatar_temperature : avatarTemp}
                    ]
                })
            } else if(searchType === 'stb_sn') {
                delete_data = await api_v1_person_access.deleteMany({
                    access_time : { $gte:date[0],$lte: date[1] },
                    stb_sn : search,
                    $and:[
                        {avatar_temperature : tempType},
                        {avatar_temperature : avatarTemp}
                    ]
                })
            }
            
        } else {
            const id = req.params === undefined ? req.id : req.params.id
            let ids = req.body.accesses_data.map(i => i._id)
            delete_data = await api_v1_person_access.deleteMany({
                _id:{
                    $in:ids
                }
            })
            req.body.accesses_data.map(access => {
                let ip = access.avatar_file_url.split(':3000')[0]
                fs.unlink(access.avatar_file_url.replace(ip+':3000/','/var/www/backend/'),() => {})
            })
        }
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