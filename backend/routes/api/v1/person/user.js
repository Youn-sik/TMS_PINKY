var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_person_user = require('../../../../models/api/v1/person/user')
const api_v1_group_group = require('../../../../models/api/v1/group/group')
const moment = require('moment');
const crypto = require('crypto');
var fs = require('fs')

router.get('/',async function(req, res) {
    try {
        let get_data
        if(req.query.type === '1') {
            get_data = await api_v1_person_user.find({type:'1'})
        } else if(req.query.type === '2') {
            get_data = await api_v1_person_user.find({type:'2'})
        } else if(req.query.type === '5') {
            get_data = await api_v1_person_user.find({type:'5'})
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
        add.avatar_file_checksum = crypto.createHash('sha256').update(req.body.avatar_file).digest('base64');
        let overlap_check = await api_v1_person_user.findOne({avatar_file_checksum : add.avatar_file_checksum})
        if(overlap_check) {
            add.avatar_file_url = overlap_check.avatar_file_url;
        } else {
            fs.writeFile('image/'+add._id+'profile.jpg',add.avatar_file,'base64',() => {})
            add.avatar_file_url = 'http://172.16.135.89:3000/image/'+add._id+'profile.jpg';
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
        let overlap_check = await api_v1_person_user.findOne({avatar_file_checksum : req.body.avatar_file_checksum})
        if(overlap_check) {
            req.body.avatar_file_url = overlap_check.avatar_file_url
        } else {
            fs.writeFile('image/'+req.body._id+'profile.jpg',req.body.avatar_file,'base64',() => {})
            req.body.avatar_file_url = 'http://172.16.135.89:3000/image/'+req.body._id+'profile.jpg';
        }
        if(String(req.body.groups_obids) !== String(req.body.clicked_groups)) {
            console.log(String(req.body.groups_obids) !== String(req.body.clicked_groups))
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
        update_data.groups_obids = req.body.clicked_groups;
        update_data.update_at = moment().format('YYYY-MM-DD HH:mm:ss');
        update_data.update_ut = Date.now;
        const update = await api_v1_person_user.findByIdAndUpdate(id, update_data, {new: true })
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
            const delete_data = await api_v1_person_user.findByIdAndRemove(id)
            res.send(delete_data);
        } catch (err) {
            throw boom.boomify(err)
        }
    } else {
        try {
            let deletedList = [];
            req.body.selectedData.map(async (i) => {
                await api_v1_group_group.updateMany({type:i.type},{ $pull: { user_obids : i._id} }, {new: true }).exec();
                deletedList.push(await api_v1_person_user.findByIdAndRemove(i._id));
            })
            res.send(deletedList);
        } catch (err) {
            throw boom.boomify(err)
        }
    }
});
 
module.exports = router;