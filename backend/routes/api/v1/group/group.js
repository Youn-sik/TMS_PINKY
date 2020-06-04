var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_group_group = require('../../../../models/api/v1/group/group')

const moveUserIds = (data) => {
    if(data.children[0] !== undefined) {
        data.children.map((i) => {
            moveUserIds(i)
        })
    }
    if(data.user_ids[0] !== undefined) {
        // console.log(data.user_ids)
        //  = data.children.concat();
        // data.user_ids.map((i) => {
        //     console.log(i);
        //     data.children.push(i);
        //     console.log(data.children)
        // })
        let array = data.user_ids.concat([data.children]);
        // console.log(array);
        data.children = array;
        console.log(data.children);
    }
}

router.get('/',async function(req, res) {
    try {
        const type = req.query.type;
        const get_data = await api_v1_group_group.find({type:type})
        .populate('user_ids')
        .populate({
            path : 'children',
            populate : [
                {
                    path: 'children',
                    populate:{path:'user_ids'}
                },
                {path: 'user_ids'},
            ],
        })
        .exec(async (err, data) => {
            data = data.filter(i => i.parent === undefined)
            data.map((i) => {
                moveUserIds(i);
            })
            res.send(data);
        });
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
        if(parent !== null) {
            api_v1_group_group.findByIdAndUpdate(parent ,{ $addToSet: { children : add._id} }, {new: true }).exec()//parent의 children에 add의 _id값 push
        }
        res.send(add.save());
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const update_data = req.body === undefined ? req : req.body
        api_v1_group_group.findByIdAndUpdate(id, update_data, {new: true })
        res.send(update);
    } catch (err) {
        throw boom.boomify(err)
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_group_group.findByIdAndRemove(id)
        res.send(delete_data);
    } catch (err) {
        throw boom.boomify(err)
    }
});
 
module.exports = router;