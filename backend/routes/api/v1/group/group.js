var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_group_group = require('../../../../models/api/v1/group/group')

router.get('/',async function(req, res) {
    try {
        const type = req.query.type;
        if(type === undefined) {
            const get_data = await api_v1_group_group.find()
            .where('parent',null)
            .where('rootParent',null)
            .populate('user_obids')
            .populate({
                path : 'children',
                populate : [
                    {
                        path: 'children',
                        populate:{path:'user_obids'}
                    },
                    {path: 'user_obids'},
                ],
            })
            res.send(get_data);
        } else {
            const get_data = await api_v1_group_group.find({type:type})
            .where('parent',null)
            .where('rootParent',null)
            .where('type',type)
            .populate('user_obids')
            .populate({
                path : 'children',
                populate : [
                    {
                        path: 'children',
                        populate:{path:'user_obids'}
                    },
                    {path: 'user_obids'},
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

        let update_data = await api_v1_group_group.findOneAndUpdate({name:'undefined',type:delete_data.type},{ 
            $addToSet: { 
                user_obids : { 
                    $each: delete_data.user_obids 
                },
                children : { 
                    $each: delete_data.children 
                }
            } 
        }, {new: true }).exec()
        
        if(!update_data) {
            update_data = new api_v1_group_group({name:'undefined',type:delete_data.type,user_obids:delete_data.user_obids,children:delete_data.children})
            update_data.save();
        }

        res.send(update_data);
    } catch (err) {
        throw boom.boomify(err)
    }
});
 
module.exports = router;