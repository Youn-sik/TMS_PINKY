var express = require('express');
var router = express.Router();
const boom = require('boom')
const api_v1_person_user = require('../../../../models/api/v1/person/user')
const api_v1_group_group = require('../../../../models/api/v1/group/group')
const Access = require('../../../../models/api/v1/person/access')
const History = require('../../../../models/api/v1/person/history')
const Operation = require('../../../../models/api/v1/person/operation')
const resizeImg = require('resize-img');
const crypto = require('crypto');

var fs = require('fs')
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get('/',async function(req, res) {
    try {
        let get_data = {}
        let auth = req.query.auth === 'admin' ? new RegExp('') : new RegExp("^"+req.query.auth+"$");
        let searchType = req.query.searchType;
        let search = req.query.search ? new RegExp(req.query.search) : new RegExp("")
        let entered = req.query.entered ? new RegExp("^"+req.query.entered+"$") : new RegExp("")
        let rowPerPage = parseInt(req.query.rowsPerPage);
        let page = parseInt(req.query.page) - 1;
        let headerType = req.query.headerType;
        let enteredName = 'entered'

        if(req.query.auth.split('-').length === 2){
            auth = new RegExp("^"+req.query.auth)
        }

        if(req.query.type === '5')
            enteredName = 'create_at'

        if(req.query.group_obid) {
            get_data.count = await api_v1_person_user.find({type:req.query.type})
            .regex('authority',auth)
            .select('-face_detection -avatar_file')
            .where("groups_obids")
            .in([req.query.group_obid])
            .regex(searchType,search)
            .regex(enteredName,entered)
            .count()

            get_data.data = await api_v1_person_user.find({type:req.query.type})
            .regex('authority',auth)
            .select('-face_detection -avatar_file')
            .where("groups_obids")
            .in([req.query.group_obid])
            .regex(searchType,search)
            .regex(enteredName,entered)
            .sort(headerType)
            .skip(page*rowPerPage)
            .limit(rowPerPage)
        } else {
            get_data.count = await api_v1_person_user.find({type:req.query.type})
            .regex('authority',auth)
            .select('-face_detection -avatar_file')
            .regex(searchType,search)
            .regex(enteredName,entered)
            .count()

            get_data.data = await api_v1_person_user.find({type:req.query.type})
            .regex('authority',auth)
            .select('-face_detection -avatar_file')
            .regex(searchType,search)
            .regex(enteredName,entered)
            .sort(headerType)
            .skip(page*rowPerPage)
            .limit(rowPerPage)
        }
        res.send(get_data);
    } catch (err) {
        res.status(400).send({err:"????????? ?????? ?????????."})
    }
});

router.get('/:id',async function(req, res) {
    try {
        const id = req.params === undefined ? req.id : req.params.id
        const get_single_data = await api_v1_person_user.findById(id)
        res.send(get_single_data)
    } catch (err) {
        res.status(400).send({err:"????????? ?????? ?????????."})
    }
});

// router.post('/',async function(req, res) {
//     try {
//         let group = null
//         let Users = await api_v1_person_user.find()
//         req.body.create_at = moment().format('YYYY-MM-DD HH:mm:ss')
//         let add = new api_v1_person_user(req.body)
//         let overlap_check = await api_v1_person_user.findOne({avatar_file_checksum : add.avatar_file_checksum})
//         if(overlap_check) {
//             add.avatar_file_url = overlap_check.avatar_file_url;
//             add.avatar_file_checksum = overlap_check.avatar_file_checksum;
//             add.avatar_contraction_data = overlap_check.avatar_contraction_data;
//             add.face_detection = overlap_check.face_detection;
//         } else {
//             let detections
//             let dir = null
//             if(req.body.avatar_file === undefined) {
//                 dir = req.body.avatar_file_url.split(":3000")[1];
//                 let oriDir = "/var/www/backend"+dir;
//                 let cpDir = "/var/www/backend/image/"+dir.split('/')[6]
//                 fs.copyFileSync(oriDir, cpDir);
//                 add.avatar_file_url = 'http://'+req.headers.host+'/image/'+dir.split('/')[6]
//                 fs.writeFileSync("/var/www/backend/image/"+dir.split('/')[6], image);
//                 let imageDir = await canvas.loadImage('http://'+req.headers.host+'/image/'+dir.split('/')[6])
//                 detections = await faceapi.detectSingleFace(imageDir,new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
//                 .withFaceLandmarks()
//                 .withFaceDescriptor();
//             } else {
//                 add.avatar_file_url = 'http://'+req.headers.host+'/image/'+add._id+'profile.jpg';
//                 fs.writeFileSync('/var/www/backend/image/'+add._id+'profile.jpg',req.body.avatar_file,'base64')
//                 let result = execSync(`python3 /var/www/backend/face_cut/face_detect.py -f /var/www/backend/image/${add._id}profile.jpg -n ${add.name} -t ${add.type}`).toString()
//                 console.log(result)
//                 add.face_detection = result.split('use_landmarks True\n')[1]
//                 add.face_detection = add.face_detection.replace('\n','')
//                 // let brightness = execSync(`python3 /var/www/backend/face_cut/get_brightness.py -f /var/www/backend/image/face_cut_${add._id}profile.jpg`)
//                 // brightness = brightness.toString()

//                 // if(brightness === "????????? ?????? ?????? ????????????.\n") {
//                     // fs.unlink('/var/www/backend/image/'+add._id+'profile.jpg',()=>{})
//                     // res.send({result:"???????????? ?????? ??????."})
//                     // return false;
//                 // }

//                 // let temp = 0.0
//                 // if(brightness < '100')
//                 //     temp = 0.2
//                 // else if(brightness < '120')
//                 //     temp = 0.1

//                 // let image = await Jimp.read(`/var/www/backend/image/face_cut_${add._id}profile.jpg`)//Jimp????????????
//                 // image.brightness(temp)//????????????
//                 // let result = await image.getBase64Async('image/png');
//                 // result = result.replace('data:image/png;base64,','')

//                 // const img = new Image();
//                 // img.src = "data:image/png;base64,"+ result

//                 // detections = await faceapi.detectSingleFace(img,new faceapi.SsdMobilenetv1Options({ minConfidence: 0.1}))
//                 // .withFaceLandmarks()
//                 // .withFaceDescriptor();
//                 // fs.unlink('/var/www/backend/image/face_cut_'+add._id+'profile.jpg',()=>{})
//             }

//             // if(!detections) {
//             //     fs.unlink('/var/www/backend/image/'+add._id+'profile.jpg',()=>{})
//             //     if(dir)
//             //         fs.unlink("/var/www/backend/image/"+dir.split('/')[6],()=>{})
//             //     res.send({
//             //         result:"???????????? ?????? ??????."
//             //     })
//             //     return false;
//             // }

//             // asyncJSON.stringify(detections.descriptor,function(err, jsonValue) {
//             //     add.face_detection = jsonValue;
//             // })

//             add.avatar_file_checksum = "avatar_file_checksum";
//         }
//         const groups = req.body.groups_obids === undefined ? null : req.body.groups_obids;
//         if(groups[0] !== null) {
//             groups.map((i) => {
//                 api_v1_group_group.findByIdAndUpdate(i ,{ $addToSet: { user_obids : add._id} }, {new: true }).exec()//groups??? children??? add??? _id??? push
//             })
//             add.groups_obids = groups
//         } else {
//             let groups = await api_v1_group_group.find({name:'undefined',type:req.body.type});
//             if(groups.length === 0) {
//                 group = new api_v1_group_group({name:'undefined',authority:req.body.authority,type:req.body.type,user_obids:[add._id]})
//                 group.save();
//                 add.groups_obids = [group._id];
//             } else {
//                 await api_v1_group_group.findOneAndUpdate({name:'undefined',type:req.body.type},{ $addToSet: { user_obids : add._id} }, {new: true }).exec()
//                 add.groups_obids = [groups[0]._id];
//             }

//         }
//         let type = '';
//         if(add.type === 1) type = '??????';
//         else if(add.type === 2) type = '?????????'
//         else if(add.type === 5) type = '???????????????'
//         const operation = new Operation({
//             id:req.body.account,
//             action: '?????? ??????',
//             date : moment().format('YYYY-MM-DD HH:mm:ss'),
//             description : add.name + ' ' + type +'??? ??????'
//         })
//         operation.save();
//         add.save();
//         res.send(add);
//     } catch (err) {
//         console.log(err);
//         res.status(400).send({err:"????????? ?????? ?????????."})
//     }
// });

// router.put('/:id',async function(req, res) {
//     try {
//         let group = null
//         // req.body.avatar_file_checksum = crypto.createHash('sha256').update(req.body.avatar_file).digest('base64');
//         const id = req.params === undefined ? req.id : req.params.id
//         const update_data = req.body === undefined ? req : req.body
//         if(String(req.body.groups_obids) !== String(req.body.clicked_groups)) {
//             req.body.groups_obids.map(async (i) => {
//                 await api_v1_group_group.findOneAndUpdate({_id:i},{ $pull: { user_obids : req.body._id} }, {new: true }).exec()
//             })
//             const groups = req.body.clicked_groups === undefined ? null : req.body.clicked_groups;
//             if(groups[0] !== undefined) {
//                 groups.map(async (i) => {
//                     await api_v1_group_group.findByIdAndUpdate(i ,{ $addToSet: { user_obids : req.body._id} }, {new: true }).exec()//groups??? children??? add??? _id??? push
//                 })
//             } else {
//                 if(await api_v1_group_group.findOne({name:'undefined',type:req.body.type}) === null) {
//                     group = new api_v1_group_group({name:'undefined',authority:req.body.authority,type:req.body.type,user_obids:[req.body._id]})
//                     group.save();
//                 } else {
//                     await api_v1_group_group.findOneAndUpdate({name:'undefined',type:req.body.type},{ $addToSet: { user_obids : req.body._id} }, {new: true }).exec()
//                 }
//                 group = group === null ? await api_v1_group_group.findOne({name:'undefined',type:req.body.type}) : group
//                 req.body.clicked_groups = [group._id];
//             }
//         }

//         if(req.body.avatar_file){
//             fs.unlink('/var/www/backend/image/'+req.body._id+"profile_updated.jpg",() => {})
//             fs.unlink('/var/www/backend/image/'+req.body._id+"profile.jpg",() => {})
//             fs.writeFileSync('/var/www/backend/image/'+req.body._id+'profile_updated.jpg',req.body.avatar_file,'base64');
//             update_data.avatar_file_url = 'http://'+req.headers.host+'/image/'+req.body._id+'profile_updated.jpg'

//             // const image = await resizeImg(fs.readFileSync('/var/www/backend/image/'+req.body._id+'profile_updated.jpg'), {
//             //     width: 140,
//             //     height: 200
//             // });

//             execSync(`python3 /var/www/backend/face_cut/align_face.py -f /var/www/backend/image/${add._id}profile_updated.jpg -o /var/www/backend/image/face_cut_${add._id}profile_updated.jpg`)
//             let brightness = execSync(`python3 /var/www/backend/face_cut/get_brightness.py -f /var/www/backend/image/face_cut_${add._id}profile_updated.jpg`)
//             brightness = brightness.toString()

//             if(brightness === "????????? ?????? ?????? ????????????.\n") {
//                 fs.unlink('/var/www/backend/image/'+add._id+'profile_updated.jpg',()=>{})
//                 res.send({result:"???????????? ?????? ??????."})
//                 return false;
//             }

//             let temp = 0.0
//             if(brightness < '100')
//                 temp = 0.2
//             else if(brightness < '120')
//                 temp = 0.1

//             let image = await Jimp.read(`/var/www/backend/image/face_cut_${add._id}profile_updated.jpg`)//Jimp????????????
//             image.brightness(temp)//????????????
//             let result = await image.getBase64Async('image/png');
//             result = result.replace('data:image/png;base64,','')

//             const img = new Image();
//             img.src = "data:image/png;base64,"+ result

//             detections = await faceapi.detectSingleFace(img,new faceapi.SsdMobilenetv1Options({ minConfidence: 0.1}))
//             .withFaceLandmarks()
//             .withFaceDescriptor();
//             fs.unlink('/var/www/backend/image/face_cut_'+add._id+'profile_updated.jpg',()=>{})

//             fs.writeFileSync('/var/www/backend/image/'+req.body._id+'profile_updated.jpg', image);

//             const imageDir = await canvas.loadImage('/var/www/backend/image/'+req.body._id+'profile_updated.jpg')
//             const detections = await faceapi.detectSingleFace(imageDir)
//             .withFaceLandmarks()
//             .withFaceDescriptor();

//             if(!detections) {
//                 res.send({
//                     result:"???????????? ?????? ??????."
//                 })
//                 return false;
//             }

//             asyncJSON.stringify(detections.descriptor,function(err, jsonValue) {
//                 update_data.face_detection = jsonValue;
//             })
//         }

//         update_data.groups_obids = req.body.clicked_groups;
//         update_data.update_at = moment().format('YYYY-MM-DD HH:mm:ss');
//         update_data.update_ut = Date.now();
//         const update = await api_v1_person_user.findOneAndUpdate({_id:id}, {$set:update_data}, {new: true })
//         let type = '';
//         if(update.type === 1) type = '??????';
//         else if(update.type === 2) type = '?????????'
//         else if(update.type === 5) type = '???????????????'
//         // const history = new History({
//         //     avatar_file : update.avatar_file,
//         //     avatar_contraction_data : update.avatar_contraction_data,
//         //     avatar_file_checksum : update.avatar_file_checksum,
//         //     avatar_file_url : update.avatar_file_url,
//         //     name : update.name,
//         //     type : update.type,
//         //     create_at : moment().format('YYYY-MM-DD HH:mm:ss'),
//         //     create_ut : Date.now(),
//         //     action : '??????',
//         // });
//         const operation = new Operation({
//             id:req.body.account,
//             action: '?????? ????????????',
//             date : moment().format('YYYY-MM-DD HH:mm:ss'),
//             description : update.name+' '+type+' ??????'
//         })
//         operation.save();
//         // history.save();
//         res.send(update);
//     } catch (err) {
//         console.log(err);
//         res.status(400).send({err:"????????? ?????? ?????????."})
//     }
// });

router.delete('/:id',async function(req, res) {
    if(!req.body.deleteAll){
        let deleted_data = []
        try {
            req.body.selectedData.map(async (i) => {
                await api_v1_group_group.updateMany({_id:i.groups_obids[0]},{ $pull: { user_obids : i._id} }, {new: true }).exec();
                let delete_data = await api_v1_person_user.findByIdAndDelete(i)
                fs.unlink('/var/www/backend/image/'+i._id+"profile.jpg",() => {})
                fs.unlink('/var/www/backend/image/'+i._id+"profile_updated.jpg",() => {})
                let type = '';
                if(delete_data.type === 1) type = '??????';
                else if(delete_data.type === 2) type = '?????????'
                else if(delete_data.type === 5) type = '???????????????'
                const operation = new Operation({
                    id:req.body.account,
                    action: '?????? ??????',
                    date : moment().format('YYYY-MM-DD HH:mm:ss'),
                    description : delete_data.name +' ??????'
                })
                operation.save();
                deleted_data.push(delete_data)
            })

            // history.save();
            res.send(deleted_data);
        } catch (err) {
            res.status(400).send({err:"????????? ?????? ?????????."})
        }
    } else {
        try {
            let deletedList = [];
            let users = [];
            let auth = req.query.auth === 'admin' ? new RegExp('') : new RegExp("^"+req.query.auth+"$");
            let searchType = req.query.searchType;
            let search = req.query.search ? new RegExp(req.query.search) : new RegExp("")
            let entered = req.query.entered ? new RegExp("^"+req.query.entered+"$") : new RegExp("")
            let rowPerPage = 5000;
            let pages = 0
            let headerType = req.query.headerType;
            let enteredName = 'entered'
            if(req.query.type === '5')
                enteredName = 'create_at'

            if(req.body.count > 5000) {
                let temp = parseInt(result.body.count/rowsPerPage)
                if(parseInt(result.body.count%rowsPerPage))
                    temp++;

                for(let i = 0; i<temp; i++) {
                    if(req.query.group_obid) {
                        users = await api_v1_person_user.find({type:req.query.type})
                        .regex('authority',auth)
                        .select('-face_detection -avatar_file')
                        .where("groups_obids")
                        .in([req.query.group_obid])
                        .regex(searchType,search)
                        .regex(enteredName,entered)
                        .skip(i*rowPerPage)
                        .limit(rowPerPage)
                    } else {
                        users = await api_v1_person_user.find({type:req.query.type})
                        .regex('authority',auth)
                        .select('-face_detection -avatar_file')
                        .regex(searchType,search)
                        .regex(enteredName,entered)
                        .skip(i*rowPerPage)
                        .limit(rowPerPage)
                    }
                }
            } else {
                if(req.query.group_obid) {
                    users = await api_v1_person_user.find({type:req.query.type})
                    .regex('authority',auth)
                    .select('-face_detection -avatar_file')
                    .where("groups_obids")
                    .in([req.query.group_obid])
                    .regex(searchType,search)
                    .regex(enteredName,entered)
                } else {
                    users = await api_v1_person_user.find({type:req.query.type})
                    .regex('authority',auth)
                    .select('-face_detection -avatar_file')
                    .regex(searchType,search)
                    .regex(enteredName,entered)
                }

            }

            users.map(async (i,index) => {
                await api_v1_group_group.updateMany({type:i.type},{ $pull: { user_obids : i._id} }, {new: true }).exec();
                deletedList.push(await api_v1_person_user.findByIdAndDelete(i._id));
                fs.unlink('/var/www/backend/image/'+i._id+"profile.jpg",() => {})
                fs.unlink('/var/www/backend/image/'+i._id+"profile_updated.jpg",() => {})
                if(users.length-1 === index) {
                    deletedList.map((i,index) => {
                        let type = '';
                        if(i.type === 1) type = '??????';
                        else if(i.type === 2) type = '?????????'
                        else if(i.type === 5) type = '???????????????'
                        const operation = new Operation({
                            id:req.body.account,
                            action: '?????? ??????',
                            date : moment().format('YYYY-MM-DD HH:mm:ss'),
                            description : i.name+' '+type+' ??????'
                        })
                        operation.save();
                        // history.save();
                    })
                    res.send(deletedList)
                }
            })
        } catch (err) {
            res.status(400).send({err:"????????? ?????? ?????????."})
        }
    }
});

module.exports = router;