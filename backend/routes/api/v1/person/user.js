var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_person_user = require('../../../../models/api/v1/person/user')
const api_v1_group_group = require('../../../../models/api/v1/group/group')
const Access = require('../../../../models/api/v1/person/access')
const History = require('../../../../models/api/v1/person/history')
const Operation = require('../../../../models/api/v1/person/operation')
const crypto = require('crypto');

var fs = require('fs')
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 

router.get('/',async function(req, res) {
    try {
        let get_data
        if(req.query.type === '1') {
            get_data = await api_v1_person_user.find({type:'1'}).select('-avatar_file -avatar_file_checksum')
        } else if(req.query.type === '2') {
            get_data = await api_v1_person_user.find({type:'2'}).select('-avatar_file -avatar_file_checksum')
        } else if(req.query.type === '5') {
            get_data = await api_v1_person_user.find({type:'5'}).select('-avatar_file -avatar_file_checksum')
        } else {
            get_data = await api_v1_person_user.find()
        }
        res.send(get_data);
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_person_user.findById(id)
        res.send(get_single_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.post('/',async function(req, res) {
    try {
        let group = null
        let add = new api_v1_person_user(req.body)
        let overlap_check = await api_v1_person_user.findOne({avatar_file_checksum : add.avatar_file_checksum})
        if(overlap_check) {
            add.avatar_file_url = overlap_check.avatar_file_url;
            add.avatar_file_checksum = overlap_check.avatar_file_checksum;
            add.avatar_contraction_data = overlap_check.avatar_contraction_data;
            add.face_detection = overlap_check.face_detection;
        } else {
            
            fs.writeFileSync('image/'+add._id+'profile.jpg',req.body.avatar_file,'base64')
            add.avatar_file_url = 'http://'+req.headers.host+':3000/image/'+add._id+'profile.jpg';
            //sha256 checksum
            let file_buffer = fs.readFileSync(__dirname+'/../../../../image/'+add._id+'profile.jpg');
            let sum = crypto.createHash('sha256');
            sum.update(file_buffer);
            const hex = sum.digest('hex');
            add.avatar_file_checksum = hex;
        }
        const groups = req.body.groups_obids === undefined ? null : req.body.groups_obids;
        if(groups !== null) {
            groups.map((i) => {
                api_v1_group_group.findByIdAndUpdate(i ,{ $addToSet: { user_obids : add._id} }, {new: true }).exec()//groups의 children에 add의 _id값 push
            })
        } else {
            if(await api_v1_group_group.findOne({name:'undefined',type:req.body.type}) === null) {
                group = new api_v1_group_group({name:'undefined',type:req.body.type,user_obids:[add._id]})
                group.save();
            } else {
                await api_v1_group_group.findOneAndUpdate({name:'undefined',type:req.body.type},{ $addToSet: { user_obids : add._id} }, {new: true }).exec()
            }
            group = group === null ? await api_v1_group_group.findOne({name:'undefined',type:req.body.type}) : group
            add.groups_obids = [group._id];
        }
        let type = '';
        if(add.type === 1) type = '사원';
        else if(add.type === 2) type = '방문자'
        else if(add.type === 5) type = '블랙리스트'
        const history = new History({
            avatar_file : add.avatar_file,
            avatar_contraction_data : add.avatar_contraction_data,
            avatar_file_checksum : add.avatar_file_checksum,
            avatar_file_url : add.avatar_file_url,
            name : add.name,
            type : add.type,
            create_at : moment().format('YYYY-MM-DD HH:mm:ss'),
            create_ut : Date.now(),
            action : '생성'
        });
        const operation = new Operation({
            id:req.body.account,
            action: '유저 생성',
            date : moment().format('YYYY-MM-DD HH:mm:ss'),
            description : add.name + ' ' + type +'에 추가'
        })
        operation.save();
        history.save();
        add.save();
        res.send(add);
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.put('/:id',async function(req, res) {
    try {
        let group = null
        req.body.avatar_file_checksum = crypto.createHash('sha256').update(req.body.avatar_file).digest('base64');
        fs.writeFileSync('image/'+req.body._id+'profile_updated_'+moment().format('YYYY-MM-DD_HH:mm:ss')+'.jpg',req.body.avatar_file,'base64');
        req.body.avatar_file_url = 'http://172.16.135.89:3000/image/'+req.body._id+'profile_updated_'+moment().format('YYYY-MM-DD_HH:mm:ss')+'.jpg';
        if(String(req.body.groups_obids) !== String(req.body.clicked_groups)) {
            req.body.groups_obids.map(async (i) => {
                await api_v1_group_group.findOneAndUpdate({_id:i},{ $pull: { user_obids : req.body._id} }, {new: true }).exec()
            })
            const groups = req.body.clicked_groups === undefined ? null : req.body.clicked_groups;
            if(groups[0] !== undefined) {
                groups.map(async (i) => {
                    await api_v1_group_group.findByIdAndUpdate(i ,{ $addToSet: { user_obids : req.body._id} }, {new: true }).exec()//groups의 children에 add의 _id값 push
                })
            } else {
                if(await api_v1_group_group.findOne({name:'undefined',type:req.body.type}) === null) {
                    group = new api_v1_group_group({name:'undefined',type:req.body.type,user_obids:[req.body._id]})
                    group.save();
                } else {
                    await api_v1_group_group.findOneAndUpdate({name:'undefined',type:req.body.type},{ $addToSet: { user_obids : req.body._id} }, {new: true }).exec()
                }
                group = group === null ? await api_v1_group_group.findOne({name:'undefined',type:req.body.type}) : group
                req.body.clicked_groups = [group._id];
            }            
        }

        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body

        const imageDir = await canvas.loadImage('image/'+req.body._id+'profile_updated_'+moment().format('YYYY-MM-DD_HH:mm:ss')+'.jpg')
        const detections = await faceapi.detectSingleFace(imageDir)
        .withFaceLandmarks()
        .withFaceDescriptor();
        asyncJSON.stringify(detections.descriptor,function(err, jsonValue) {
            update_data.face_detection = jsonValue;
        })
        
        update_data.groups_obids = req.body.clicked_groups;
        update_data.update_at = moment().format('YYYY-MM-DD HH:mm:ss');
        update_data.update_ut = Date.now();
        const update = await api_v1_person_user.findOneAndUpdate({_id:id}, {$set:update_data}, {new: true })
        let type = '';
        if(update.type === 1) type = '사원';
        else if(update.type === 2) type = '방문자'
        else if(update.type === 5) type = '블랙리스트'
        const history = new History({
            avatar_file : update.avatar_file,
            avatar_contraction_data : update.avatar_contraction_data,
            avatar_file_checksum : update.avatar_file_checksum,
            avatar_file_url : update.avatar_file_url,
            name : update.name,
            type : update.type,
            create_at : moment().format('YYYY-MM-DD HH:mm:ss'),
            create_ut : Date.now(),
            action : '수정',
        });
        const operation = new Operation({
            id:req.body.account,
            action: '유저 업데이트',
            date : moment().format('YYYY-MM-DD HH:mm:ss'),
            description : update.name+' '+type+' 수정'
        })
        operation.save();
        history.save();
        res.send(update);
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    if(!req.body.selectedData){
        try {
            await api_v1_group_group.updateMany({type:req.body.type},{ $pull: { user_obids : req.body._id} }, {new: true }).exec();
            const id = req.params === undefined ? req.id : req.params.id
            const delete_data = await api_v1_person_user.findByIdAndDelete(id)
            let type = '';
            if(delete_data.type === 1) type = '사원';
            else if(delete_data.type === 2) type = '방문자'
            else if(delete_data.type === 5) type = '블랙리스트'
            const history = new History({
                avatar_file : delete_data.avatar_file,
                avatar_contraction_data : delete_data.avatar_contraction_data,
                avatar_file_checksum : delete_data.avatar_file_checksum,
                avatar_file_url : delete_data.avatar_file_url,
                name : delete_data.name,
                type : delete_data.type,
                create_at : moment().format('YYYY-MM-DD HH:mm:ss'),
                create_ut : Date.now(),
                action : '삭제',
            });
            const operation = new Operation({
                id:req.body.account,
                action: '유저 삭제',
                date : moment().format('YYYY-MM-DD HH:mm:ss'),
                description : delete_data.name +' 삭제'
            })
            operation.save();
            history.save();
            res.send(delete_data);
        } catch (err) {
            throw boom.boomify(err)
        }
    } else {
        try {
            let deletedList = [];
            req.body.selectedData.map(async (i,index) => {
                await api_v1_group_group.updateMany({type:i.type},{ $pull: { user_obids : i._id} }, {new: true }).exec();
                deletedList.push(await api_v1_person_user.findByIdAndDelete(i._id));
                if(req.body.selectedData.length-1 === index) {
                    deletedList.map((i,index) => {
                        let type = '';
                        if(i.type === 1) type = '사원';
                        else if(i.type === 2) type = '방문자'
                        else if(i.type === 5) type = '블랙리스트'
                        const history = new History({
                            avatar_file : i.avatar_file,
                            avatar_contraction_data : i.avatar_contraction_data,
                            avatar_file_checksum : i.avatar_file_checksum,
                            avatar_file_url : i.avatar_file_url,
                            name : i.name,
                            type : i.type,
                            create_at : moment().format('YYYY-MM-DD HH:mm:ss'),
                            create_ut : Date.now(),
                            action : '삭제',
                        });
                        const operation = new Operation({
                            id:req.body.account,
                            action: '유저 삭제',
                            date : moment().format('YYYY-MM-DD HH:mm:ss'),
                            description : i.name+' '+type+' 삭제'
                        })
                        operation.save();
                        history.save();
                    })
                    res.send(deletedList)
                }
            })
        } catch (err) {
            throw boom.boomify(err)
        }
    }
});
 
module.exports = router;