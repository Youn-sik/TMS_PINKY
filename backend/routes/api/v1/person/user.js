var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_person_user = require('../../../../models/api/v1/person/user')
const api_v1_group_group = require('../../../../models/api/v1/group/group')
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
        let add = new api_v1_person_user(req.body)
        fs.writeFile('image/'+add._id+'profile.jpg',add.avatar_file,'base64',() => {})
        add.avatar_file = 'image/'+add._id+'profile.jpg';
        const groups = req.body.groups === undefined ? null : req.body.groups;
        if(groups !== null) {
            api_v1_group_group.findByIdAndUpdate(groups ,{ $addToSet: { user_ids : add._id} }, {new: true }).exec()//groups의 children에 add의 _id값 push
        } else {
            if(await api_v1_group_group.findOne({name:'undefined'}) === null) {
                let group = new api_v1_group_group({name:'undefined',type:req.body.type,user_ids:[add._id]})
                group.save();
            } else {
                await api_v1_group_group.findOneAndUpdate({name:'undefined'},{ $addToSet: { user_ids : add._id} }, {new: true }).exec()
            }
        }
        add.save();
        res.send(add);
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        const update = await api_v1_person_user.findByIdAndUpdate(id, update_data, {new: true })
        res.send(update);
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_person_user.findByIdAndRemove(id)
        res.send(delete_data);
    } catch (err) {
        throw boom.boomify(err)
    }
});
 
module.exports = router;