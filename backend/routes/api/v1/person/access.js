var express = require('express');
var router = express.Router();
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const boom = require('boom')
const api_v1_person_access = require('../../../../models/api/v1/person/access')
const api_v3_device_camera = require('../../../../models/api/v3/device/camera')
const Statistics = require('../../../../models/api/v3/device/statistics')
const StatisticsTemp = require('../../../../models/api/v3/device/statistics_temp')
const exec = require('child_process').exec;
const fs = require('fs')

router.get('/',async function(req, res) {
    try {
        // access_time : { $gte:week[0],$lte: week[1] }

        let get_data;
        let date = new RegExp(moment().format('YYYY-MM-DD'));
        let today = new RegExp(moment().format('YYYY-MM-DD'));
        let week = [moment().day(1).format('YYYY-MM-DD')+" 00:00:00",moment().day(7).format('YYYY-MM-DD')+" 23:59:59"]
        let auth = req.query.auth === 'admin' ? new RegExp('') : new RegExp("^"+req.query.auth+"$")
        if(req.query.auth.split('-').length === 2){
            auth = new RegExp("^"+req.query.auth)
        }
        
        if(req.query.type === 'todayStatistics') {
            let employee = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 1,
                        access_time : {$regex:date},
                        authority : {$regex:auth}
                    }
                },
                {
                    $count: 'count'
                },
            ]).allowDiskUse(true);

            let black = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 4,
                        access_time : {$regex:date},
                        authority : {$regex:auth}
                    }
                },
                {
                    $count: 'count'
                },
            ]).allowDiskUse(true);

            let stranger = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 3,
                        access_time : {$regex:date},
                        authority : {$regex:auth}
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
            let employee = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 1,
                        access_time : { $gte:week[0],$lte: week[1] },
                        authority : {$regex:auth}
                    }
                },
                {
                    $count: 'count'
                },
            ]).allowDiskUse(true);

            let black = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 4,
                        access_time : { $gte:week[0],$lte: week[1] },
                        authority : {$regex:auth}
                    }
                },
                {
                    $count: 'count'
                },
            ]).allowDiskUse(true);

            let stranger = await api_v1_person_access.aggregate([
                {
                    $match: {
                        avatar_type : 3,
                        access_time : { $gte:week[0],$lte: week[1] },
                        authority : {$regex:auth}
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
            let auth = req.query.auth === 'admin' ? new RegExp('') : new RegExp("^"+req.query.auth+"$");
            if(req.query.auth.split('-').length === 2){
                auth = new RegExp("^"+req.query.auth)
            }

            if(device === '')
                device = new RegExp('')
            else
                device = new RegExp("^"+req.query.device+"$");
            
            get_data = await Statistics.find()
            .gte("access_date",date[0]+" 00:00:00")
            .lte("access_date",date[1]+" 23:59:59")
            .regex('authority',auth)
            .regex('serial_number', device)
        } else if(req.query.type === 'deviceGroupAccesses') {
            let date = req.query.date.split('/');
            let device = req.query.device
            let auth = req.query.auth === 'admin' ? new RegExp('') : new RegExp("^"+req.query.auth+"$");
            if(req.query.auth.split('-').length === 2){
                auth = new RegExp("^"+req.query.auth)
            }

            if(device === 'all') {
                get_data = {
                    access : await Statistics.find()
                    .regex('access_date' , date[0])
                    .regex('authority',auth),
                }
            } else {
                get_data = {
                    access : await Statistics.find()
                    .regex('access_date' , date[0])
                    .where('serial_number' ,device),
                }
            }
        } 
        else if(req.query.type === 'todayAttendance') {
            get_data = await api_v1_person_access.aggregate([
                {
                    $match: {
                        access_time : {$regex:today},
                        avatar_type : 1,
                        authority : {$regex:auth}
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
            let auth = req.query.auth === 'admin' ? new RegExp('') : new RegExp("^"+req.query.auth+"$");
            if(req.query.auth.split('-').length === 2){
                auth = new RegExp("^"+req.query.auth)
            }
            get_data = await api_v1_person_access.find()
                .where('avatar_temperature')
                .sort('-access_time')
                .regex('authority',auth)
                .limit(5)
        } else if(req.query.type === 'attendance') {
            get_data = await api_v1_person_access.aggregate([
                {
                    $match: {avatar_type : 1},
                    authority : {$regex:auth}
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
            let avatar_type = parseInt(req.query.avatar_type);
            let tempType = req.query.tempType;
            let avatar_temperature = req.query.avatar_temperature;
            let stb_sn = '';
            let stb_name = '';
            let stb_location = '';
            let name = ''
            let auth = req.query.auth === 'admin' ? new RegExp('') : new RegExp("^"+req.query.auth+"$");
            if(req.query.auth.split('-').length === 2){
                auth = new RegExp("^"+req.query.auth)
            }

            if(search === '') {
                search === new RegExp('')
            }
            
            if(req.query.searchType === 'name') {
                name = new RegExp(search)
            } else if(req.query.searchType === 'stb_name') {
                stb_name = new RegExp(search)
            } else if(req.query.searchType === 'stb_location') {
                stb_location = new RegExp(search)
            } else if(req.query.searchType === 'stb_sn') {
                stb_sn = new RegExp(search)
            }

            if(avatar_type && avatar_temperature && tempType) { //??????,?????? ?????? ????????? ??????
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
                                avatar_temperature : { $gte: avatar_temperature },
                                authority : {$regex:auth}
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
                                access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"},
                                name : { $regex:new RegExp(name) },
                                stb_sn : { $regex:new RegExp(stb_sn) },
                                stb_name : { $regex:new RegExp(stb_name) },
                                stb_location : { $regex:new RegExp(stb_location) },
                                avatar_type : avatar_type,
                                avatar_temperature : { $lt: avatar_temperature },
                                authority : {$regex:auth}
                            }
                        },
                        {
                            $count : 'count'
                        }
                    ]).allowDiskUse(true);
                }
            } else if (avatar_type) { //????????? ????????? ????????? ??????
                get_data = await api_v1_person_access.aggregate([
                    {
                        $match: {
                            access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"},
                            name : { $regex:new RegExp(name) },
                            stb_sn : { $regex:new RegExp(stb_sn) },
                            stb_name : { $regex:new RegExp(stb_name) },
                            stb_location : { $regex:new RegExp(stb_location) },
                            authority : {$regex:auth},
                            avatar_type : avatar_type,
                        }
                    },
                    {
                        $count : 'count'
                    }
                ]).allowDiskUse(true);
            } else if (avatar_temperature && tempType) {//?????? ????????? ????????? ??????
                if(tempType === '2') {
                    get_data = await api_v1_person_access.aggregate([
                        {
                            $match: {
                                access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"},
                                name : { $regex:new RegExp(name) },
                                stb_sn : { $regex:new RegExp(stb_sn) },
                                stb_name : { $regex:new RegExp(stb_name) },
                                stb_location : { $regex:new RegExp(stb_location) },
                                avatar_temperature : { $gte: avatar_temperature },
                                authority : {$regex:auth}
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
                                access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"},
                                name : { $regex:new RegExp(name) },
                                stb_sn : { $regex:new RegExp(stb_sn) },
                                stb_name : { $regex:new RegExp(stb_name) },
                                stb_location : { $regex:new RegExp(stb_location) },
                                avatar_temperature : { $lt: avatar_temperature },
                                authority : {$regex:auth}
                            }
                        },
                        {
                            $count : 'count'
                        }
                    ]).allowDiskUse(true);
                }   
            } else { //?????? ???????????????
                get_data = await api_v1_person_access.aggregate([
                    {
                        $match: {
                            access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"},
                            name : { $regex:new RegExp(name) },
                            stb_sn : { $regex:new RegExp(stb_sn) },
                            stb_name : { $regex:new RegExp(stb_name) },
                            stb_location : { $regex:new RegExp(stb_location) },
                            authority : {$regex:auth}
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
            let stb_location = '';
            let auth = req.query.auth === 'admin' ? new RegExp('') : new RegExp("^"+req.query.auth+"$");
            if(req.query.auth.split('-').length === 2){
                auth = new RegExp("^"+req.query.auth)
            }

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
            } else if(req.query.searchType === 'name') {
                name = search
            } 

            if(req.query.execPage) {
                page = parseInt(req.query.execPage) - 1
                rowPerPage = parseInt(req.query.execRowPerPage)
            }

            if(avatar_type && avatar_temperature && tempType) { //??????,?????? ?????? ????????? ??????
                if(tempType === '2') {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
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
                    .regex("authority",auth)
                } else {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)
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
                    .regex("authority",auth)
                }
            } else if (avatar_type) { //????????? ????????? ????????? ??????
                get_data = await api_v1_person_access.find()
                .sort(headerType)
                .where("avatar_type").equals(avatar_type)
                .gte("access_time",date[0]+" 00:00:00")
                .lte("access_time",date[1]+" 23:59:59")
                .regex("stb_sn",new RegExp(stb_sn))
                .regex("stb_name",new RegExp(stb_name))
                .regex("stb_location",new RegExp(stb_location))
                .regex("name",new RegExp(name))
                .skip(page*rowPerPage)
                .limit(rowPerPage)
                .regex("authority",auth)
            } else if (avatar_temperature && tempType) {//?????? ????????? ????????? ??????
                if(tempType === '2') {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)

                    .gte('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0]+" 00:00:00")
                    .lte("access_time",date[1]+" 23:59:59")
                    .regex("stb_sn",new RegExp(stb_sn))
                    .regex("name",new RegExp(name))
                    .regex("stb_name",new RegExp(stb_name))
                    .regex("stb_location",new RegExp(stb_location))
                    .skip(page*rowPerPage)
                    .limit(rowPerPage)
                    .regex("authority",auth)
                } else {
                    get_data = await api_v1_person_access.find()
                    .sort(headerType)

                    .lt('avatar_temperature', parseFloat(avatar_temperature))
                    .gte("access_time",date[0]+" 00:00:00")
                    .lte("access_time",date[1]+" 23:59:59")
                    .regex("stb_sn",new RegExp(stb_sn))
                    .regex("stb_name",new RegExp(stb_name))
                    .regex("stb_location",new RegExp(stb_location))
                    .regex("name",new RegExp(name))
                    .skip(page*rowPerPage)
                    .limit(rowPerPage)
                    .regex("authority",auth)
                }   
            }else { //?????? ???????????????
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
                .regex("authority",auth)
            }
        }
        res.send(get_data)
    } catch (err) {
        res.status(400).send({err:"????????? ?????? ?????????."})
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_person_access.findById(id)
        res.send(get_single_data)
    } catch (err) {
        res.status(400).send({err:"????????? ?????? ?????????."})
    }
});

router.post('/',function(req, res) {
    try {
        const add = new api_v1_person_access(req.body)
        res.send(add.save())
    } catch (err) {
        res.status(400).send({err:"????????? ?????? ?????????."})
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await api_v1_person_access.findByIdAndUpdate(id, update_data, {new: true })
        return update
    } catch (err) {
        res.status(400).send({err:"????????? ?????? ?????????."})
    }
});

function regExp(str){  
    var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    //???????????? ??????
    if(reg.test(str)){
        //???????????? ????????? ??????
        return str.replace(reg, "");    
    } else {
        //??????????????? ???????????? ?????? ?????? ??????
        return str;
    }  
}

const createNumberRegex = (target, type) => {
    if (target > 89 || target < 20) {
        return null;
    }

    console.log(type)

    let ten = Math.floor(target / 10),
        one = Math.floor(target % 10),
        under = Number((target % 1).toFixed(1)) * 10, regex = null;

    if (type == '2') {
        // ??????
        regex = `_((${ten}${one}\.[${under}-9][0-9]{0,})|${one != 9 ? `(${ten}[${one + 1}-9])\.([0-9]{0,})|` : ''}([${ten + 1}-9][0-9]|[0-9]{3,})\.([0-9]{0,}))_`;
    } else if (type == '1') {
        // ??????
        regex = `_(${under != 0 ? `(${ten}${one}\.[0-${under - 1}][0-9]{0,})|` : ''}${one != 0 ? `(${ten}[0-${one - 1}])\.([0-9]{0,})|` : ''}([1-${ten - 1}][0-9]|[0-9]{1})\.([0-9]{0,}))_`;
    } else {
        regex = '_([0-9.]*)_'
    }

    return regex;
};

router.delete('/',async function(req, res) {
    try {
        let delete_data;
        let deleted_accesses = [];
        if(req.query.type === 'all') {
            let searchType = req.query.searchType
            let search = req.query.search
            let date = req.query.date.split('/');
            let tempType = req.query.tempType
            let tempLimit = req.query.avatar_temperature
            let devices = [];
            let name = '';
            let type = req.query.avatar_type === '0' ? '([0-9]*)' : req.query.avatar_type;
            let mathchingType = req.query.avatar_type
            let auth = req.query.auth === 'admin' ? new RegExp('') : new RegExp("^"+req.query.auth+"$")
            if(req.query.auth.split('-').length === 2){
                auth = new RegExp("^"+req.query.auth)
            }
            let temperature = req.query.tempType === '0' ? {$gte : '0'} :
                            req.query.tempType === '1' ? {$lt : req.query.avatar_temperature} :  {$gte : req.query.avatar_temperature}

            if(req.query.avatar_type === '0') {
                if(searchType === 'stb_name') {
                    delete_data = await api_v1_person_access.deleteMany({
                        access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"},
                        stb_name : new RegExp(search),
                        avatar_temperature : temperature,
                    })
                } else if(searchType === 'stb_location'){
                    delete_data = await api_v1_person_access.deleteMany({
                        access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"},
                        stb_location : new RegExp(search),
                        avatar_temperature : temperature,
                    })
                } else if(searchType === 'stb_sn') {
                    delete_data = await api_v1_person_access.deleteMany({
                        access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                        stb_sn : new RegExp(search),
                        avatar_temperature : temperature,
                    })
                } else if (searchType === 'name') {
                    delete_data = await api_v1_person_access.deleteMany({
                        access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                        name : new RegExp(search),
                        avatar_temperature : temperature,
                    })
                }
            } else {
                if(searchType === 'stb_name') {
                    delete_data = await api_v1_person_access.deleteMany({
                        access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"},
                        stb_name : new RegExp(search),
                        avatar_temperature : temperature,
                        avatar_type : mathchingType
                    })
                } else if(searchType === 'stb_location'){
                    delete_data = await api_v1_person_access.deleteMany({
                        access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59"},
                        stb_location : new RegExp(search),
                        avatar_temperature : temperature,
                        avatar_type : mathchingType
                    })
                } else if(searchType === 'stb_sn') {
                    delete_data = await api_v1_person_access.deleteMany({
                        access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                        stb_sn : new RegExp(search),
                        avatar_temperature : temperature,
                        avatar_type : mathchingType
                    })
                } else if (searchType === 'name') {
                    delete_data = await api_v1_person_access.deleteMany({
                        access_time : { $gte:date[0]+" 00:00:00",$lte: date[1]+" 23:59:59" },
                        name : new RegExp(search),
                        avatar_temperature : temperature,
                        avatar_type : mathchingType
                    })
                }
            }

            if(searchType === 'stb_location') {
                devices = await api_v3_device_camera.find()
                .regex('authority',auth)
                .regex('location',new RegExp(search))
                .select('serial_number')
                devices = devices.map(device => device.serial_number)
            } else if(searchType === 'stb_name'){
                devices = await api_v3_device_camera.find()
                .regex('authority',auth)
                .regex('name',new RegExp(search))
                .select('serial_number')
                devices = devices.map(device => device.serial_number)
            } else if(searchType === 'stb_sn'){
                devices = [search]
            } else if(searchType === 'name') {
                name = req.query.search ? req.query.search : '';
            }

            
            
            
            let tempRegex = createNumberRegex(parseFloat(tempLimit), tempType)
            
            let firstDate = moment(date[0])
            let lastDate = moment(date[1]).add(1, 'days')

            console.log ('?????? ??????:: ', __dirname, process.cwd());

            while (firstDate.isBefore(lastDate, 'day')) {
                let deleteDate = firstDate.format('YYYYMMDD')

                if(devices.length > 0) {
                    devices.forEach(device => exec(`find /var/www/backend/uploads/accesss/temp/${deleteDate} | egrep '([^_]*)${device}([^_]*)_([^_]*)${name}([^_]*)_${type}${tempRegex}([0-9]*).png' | tr '\\n' '\\0' | xargs -0 rm`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(error);
                            return;
                        }

                        console.log(`stdout: ${stdout}`);
                        console.error(`stderr: ${stderr}`);
                    }))
                } else {
                    exec(`find /var/www/backend/uploads/accesss/temp/${deleteDate} | egrep '([^_]*)([^_]*)_([^_]*)${name}([^_]*)_${type}${tempRegex}([0-9]*).png' | tr '\\n' '\\0' | xargs -0 rm`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(error);
                            return;
                        }

                        console.log(`stdout: ${stdout}`);
                        console.error(`stderr: ${stderr}`);
                    });
                }

                firstDate.add(1, 'days');
            }

            // find ./uploads/accesses/temp/20201026 | egrep '([^_]*)([^_]*)_([^_]*)??????([^_]*)_([0-9]*)null([0-9]*).png'

            // if(devices.length > 0) {
            //     devices = devices.map(device => exec(`find . | egrep '([^_]*)${device.serial_number}([^_]*)_([^_]*)${name}([^_]*)_${type}${tempRegex}([0-9]*).png' | tr '\n' '\0' | xargs -0 rm`))
            // } else {
            //     exec(`find ./uploads/accesses/temp/${} | egrep '([^_]*)([^_]*)_([^_]*)${name}([^_]*)_${type}${tempRegex}([0-9]*).png' | tr '\n' '\0' | xargs -0 rm`);
            // }

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
        res.status(400).send({err:"????????? ?????? ?????????."})
    }
});

//???????????? resolve
// exports.getapi_v1_person_access_depend_on_user = async (req, reply) => {
//     try {
//         const id = req.params === undefined ? req.id : req.params.id
//         const depend_on_data = await api_v1_person_access.find({ reception_user_id : id })
//         return depend_on_data
//     }catch (err) {
//         res.status(400).send({err:"????????? ?????? ?????????."})
//     }
// }

module.exports = router;