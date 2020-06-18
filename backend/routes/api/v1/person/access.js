var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_person_access = require('../../../../models/api/v1/person/access')

router.get('/',async function(req, res) {
    try {
        let get_data;
        if(req.query.type === '3') {
            get_data = await api_v1_person_access.find({avatar_type:3}).sort('-access_time').select('-avatar_file -avatar_contraction_data')
        } else if(req.query.type === 'todayStatistics') {
            get_data = await api_v1_person_access.aggregate([
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
            ])
        } else {
            get_data = await api_v1_person_access.find().sort('-access_time').select('-avatar_file -avatar_contraction_data')
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

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await api_v1_person_access.findByIdAndRemove(id)
        res.dend(delete_data)
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