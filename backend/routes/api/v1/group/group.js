var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_group_group = require('../../../../models/api/v1/group/group')
const api_v1_person_user = require('../../../../models/api/v1/person/user')
var fs = require('fs')

router.get('/',async function(req, res) {
    try {
        const type = req.query.type;
        let auth = req.query.auth === 'admin' ? new RegExp('') : new RegExp("^"+req.query.auth+"$")
        if(type === undefined) {
            const get_data = await api_v1_group_group.find()
            .where('parent',null)
            .where('rootParent',null)
            .regex('authority',auth)
            .populate({
                path : 'children',
                populate : [
                    {
                        path: 'children',
                    },
                ],
            })
            res.send(get_data);
        } else {
            const get_data = await api_v1_group_group.find({type:type})
            .where('parent',null)
            .where('rootParent',null)
            .regex('authority',auth)
            .where('type',type)
            .populate({
                path : 'children',
                populate : [
                    {
                        path: 'children',
                    },
                ],
            })
            res.send(get_data);
        }
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_group_group.findById(id)
        res.send(get_single_data)
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.post('/',async function(req, res) {
    try {
        console.log(req.body.authority);
        const add = new api_v1_group_group(req.body)
        const parent = req.body.parent === undefined ? null : req.body.parent;
        const parentObject = await api_v1_group_group.findById(parent);
        if(parentObject !== null) {
            add['rootParent'] = parentObject.parent;
        }
        if(parent !== null) {
            api_v1_group_group.findByIdAndUpdate(parent ,{ $addToSet: { children : add._id} }, {new: true }).exec()//parent의 children에 add의 _id값 push
        }
        add.save()
        res.send(add);
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body
        let update = await api_v1_group_group.findByIdAndUpdate(id, update_data, {new: true })
        res.send(update);
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_group_group.findByIdAndRemove(id)

        delete_data.user_obids.map(user_obid => {
            fs.unlink('/var/www/backend/image/'+user_obid+"profile.jpg",() => {})
            fs.unlink('/var/www/backend/image/'+user_obid+"profile_updated.jpg",() => {})
        })

        res.send(delete_data);
    } catch (err) {
        throw boom.boomify(err)
    }
});

module.exports = router;