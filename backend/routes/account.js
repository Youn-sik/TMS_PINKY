var express = require('express');
var router = express.Router();
const boom = require('boom')
const User = require('../models/User')
const Operation = require('../models/api/v1/person/operation');
const crypto = require('crypto');
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 

router.get('/',async function(req, res) {
    try {
        let users;
        if(req.query.authority === 'admin') {
            users = await User.find().select('user_id user_lang user_name authority')
        } else {
            let auth = req.query.authority;
            let regex = new RegExp("^"+auth+"$");
            if(req.query.authority.split('-').length === 2){
                regex = new RegExp("^"+auth)
            } else if (req.query.authority.split('-').length > 2) {
                new RegExp("^"+auth+"$");
            }

            users = await User.find().select('user_id user_lang user_name authority').regex('authority', regex);
        }
        res.send(users)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다"})
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const user = await User.findById(id).select('user_id user_lang user_name authority')
        res.send(user)
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.post('/',async function(req, res) {
    try {
        const add = new User(req.body)
        if(!req.body.account) return res.status(400).send({"err":"잘못된 형식 입니다"})
        crypto.randomBytes(64,(err,buf) => {
            crypto.pbkdf2(req.body.user_pw, buf.toString('base64'), 105614, 64, 'sha512', (err,key) => {
                add.user_pw = key.toString('base64');
                add.salt = buf.toString('base64');
                add.save(function(err,re) {
                    if(err) return res.status(400).send({"err":"잘못된 형식 입니다"})
                    const operation = new Operation({
                        id:req.body.account,
                        description: add.user_id+' 계정 생성',
                        action: '계정 생성',
                        date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    })
                    operation.save();
                    res.send({"success":"계정 생성 완료"})
                })
            })
        })
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.put('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        if(!req.body.user_pw) {
            const update = await User.findOneAndUpdate({_id:id}, {$set:req.body}, {new: true })
            const operation = new Operation({
                id:req.body.account,
                description: update.user_id+' 계정 수정',
                action: '계정 수정',
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
            })
            operation.save();
            update.user_pw = ''
            update.salt = ''    
            res.send(update);
            return false;
        } else {
            crypto.randomBytes(64,(err,buf) => {
                crypto.pbkdf2(req.body.user_pw, buf.toString('base64'), 105614, 64, 'sha512', async (err,key) => {
                    req.body.user_pw = key.toString('base64');
                    req.body.salt = buf.toString('base64');
                    const update = await User.findOneAndUpdate({_id:id}, {$set:req.body}, {new: true })
                    const operation = new Operation({
                        id:req.body.account,
                        description: update.user_id+' 계정 수정',
                        action: '계정 수정',
                        date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    })
                    operation.save();
                    update.user_pw = ''
                    update.salt = '' 
                    res.send(update);
                })
            })
        }
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

router.delete('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const delete_data = await User.findByIdAndRemove(id)
        const operation = new Operation({
            id:req.body.account,
            description: delete_data.user_id+' 계정 삭제',
            action: '계정 삭제',
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        operation.save(); 
        delete_data.user_pw = ''
        delete_data.salt = ''
        res.send(delete_data);
    } catch (err) {
        res.status(400).send({err:"잘못된 형식 입니다."})
    }
});

module.exports = router;