const fs = require("fs");
const path = require('path');
const site_info_json = fs.readFileSync(path.join(__dirname, "./cloud40.json"));
const site = JSON.parse(site_info_json);
const imageInfo = require('image-info');
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
const mkdirp = require('mkdirp');
const client = require('./mqtt_load');

const mqtt_option = {
    retain: false,
    qos: 0
}

const Influx = require('influx');
const influx = new Influx.InfluxDB({
    host: site.influxdb,
    database: 'g_rrd'
});

class InfluxQueue {
    constructor() {
        this._queue = [];
    }

    push(data) {
        this._queue.push(data);
    }

    getAll() {
        let data = this._queue.splice(0, this._queue.length);
        this._queue = [];
        return data;
    }

    get length() {
        return this._queue.length;
    }
}

const influxInterver = 10000;
const influxQueue = new InfluxQueue();

let influxInterverId = setInterval(() => {
    if (influxQueue.length > 0) {
        let data = influxQueue.getAll();
        influx.writePoints(data).then(() => {
            console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' ' + data.length + " RRD data was saved.");
            data = null;
        }).catch((err) => console.error(err.message));
    }
}, influxInterver);

const mongoose = require('mongoose');
const mongodb = mongoose.connection;
mongodb.on('error', console.error);
mongodb.once('open', function () {
    console.log('mongodb open');
});

mongoose.connect('mongodb://' + site.mongodb_host + ':27017/' + site.mongodb_database + '?poolSize=4', { useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex: true});

const Access = require('./schema/access_Schema');
const Camera = require('./schema/camera_Schema');
const Gateway = require('./schema/gateway_Schema');
const Group = require('./schema/group_Schema');
const Statistics = require('./schema/statistics_Schema');
const User = require('./schema/user_Schema');
const Version = require('./schema/version_Schema');
const glogs = require('./schema/glogs_Schema');
const Camera_fail = require('./schema/camera_fail_Schema');
const Camera_monitor = require('./schema/camera_monitor_Schema');
const Camera_filelist = require('./schema/camera_filelist_Schema');
const History = require('./schema/history_Schema');

/*
let data = {
    name : "changbab",
    location : "location",
    ip : "172.16.135.89",
    port : "4320",
    user_obids : ['5ede078087ef1a04252d9c33'],
    camera_obids : ['5eddcfa6c5965509a7631516'],
    description : "설명"
};

let newUser = new Gateway(data);
newUser.save(function (error, data2){
    console.log("1234");
})
*/

module.exports = {
    async login(json) {
        await Camera.findOne( { serial_number : json.stb_sn }, (err, camera) => {
            if (err) {
                console.log(err);
            }else{
                if(camera === null){
                    let newCameraFails = new Camera_fail({ serial_number: json.stb_sn });
                    newCameraFails.save(function (error, data) {
                        if (error) {
                            console.log(error);
                        }
                        send_data = {
                            stb_sn: json.stb_sn,
                            message: "login",
                            result: "fail"
                        };
                        client.publish('/login/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
                    });
                }else{
                    camera.status = "Y";
                    camera.info_update_time = moment().format('YYYY-MM-DD HH:mm:ss');
                    if(json.stb_mac) camera.config_data.mac_address = json.stb_mac;
                    if(json.stb_version) camera.app_version = json.stb_version;
                    if(json.stb_ip) camera.ip = json.stb_ip;
                    camera.save( (err) => {
                        if(err){
                            console.log(err);
                        } else{
                            if(camera.config_data.capture_status === "Y"){
                                send_data = {
                                    stb_sn: camera.serial_number,
                                    message: "login",
                                    result: "ok",
                                    stb_id: camera.name,
                                    capture_option : {
                                        capture_time: camera.config_data.capture_time,
                                        capture_size: camera.config_data.capture_size,
                                        capture_status: camera.config_data.capture_status
                                    }
                                };
                            }else{
                                send_data = {
                                    stb_sn: camera.serial_number,
                                    message: "login",
                                    result: "ok",
                                    stb_id: camera.name,
                                    capture_option : ""
                                };
                            }
                            client.publish('/login/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);

                            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 1, log_message: 'login', create_dt: json.create_time });
                            newGlogs.save(function (error, data) {
                                if (error) {
                                    console.log(error);
                                }
                            });
                        }
                    });
                }
            }
        })
    },

    async logout(json) {
        await Camera.findOne( { serial_number : json.stb_sn }, (err, camera) => {
            if (err) {
                console.log(err);
            }else{
                if(camera === null){
                    
                }else{
                    camera.status = "N";
                    camera.save( (err) => {
                        if(err){
                            console.log(err);
                        }else{
                            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 2, log_message: 'logout', create_dt: json.create_time });
                            newGlogs.save(function (error, data) {
                                if (error) {
                                    console.log(error);
                                }
                            });
                        }
                    });
                }
            }
        })
    },

    async disconnect_result(json) {
        await Camera.findOne( { serial_number : json.stb_sn }, (err, camera) => {
            if (err) {
                console.log(err);
            }else{
                if(camera === null){
                    
                }else{
                    camera.status = "N";
                    camera.save( (err) => {
                        if(err){
                            console.log(err);
                        }else{
                            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 3, log_message: 'disconnect', create_dt: json.create_time });
                            newGlogs.save(function (error, data) {
                                if (error) {
                                    console.log(error);
                                }
                            });
                        }
                    });
                }
            }
        })
    },

    async download(json) {
        await Camera.findOne( { serial_number : json.stb_sn }, (err, camera) => {
            if (err) {
                console.log(err);
            }else{
                if(camera === null){
                    
                }else{
                    if(json.percent > 95){
                        camera.status = "Y";
                        camera.download_current = 100;
                        camera.save( (err) => {
                            if(err){
                                console.log(err);
                            }else{
                                let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 4, log_message: 'contents_down_success', create_dt: json.create_time });
                                newGlogs.save(function (error, data) {
                                    if (error) {
                                        console.log(error);
                                    }
                                });

                                send_data = {
                                    stb_sn: json.stb_sn,
                                    percent: json.percent,
                                    message: "download"
                                };
                                client.publish('/download/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
                            }
                        });
                    }else{
                        camera.status = "Y";
                        camera.download_current = json.percent;
                        camera.save( (err) => {
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
            }
        })
    },

    async access_request(json) {
        await Camera.findOne( { serial_number : json.stb_sn }, (err, camera) => {
            if (err) {
                console.log(err);
            }else{
                User.find( {}, (err, user) => {
                    if (err) {
                        console.log(err);
                    }else{
                        let user_array = [];
                        user.forEach(function(element){
                            let type = null
                            if(element.type === 1) type = 1
                            else if(element.type === 2) type = 2
                            else if(element.type === 5) type = 4
                            else type = 3
                            let user_data = {
                                avatar_file_url: element.avatar_file_url,
                                avatar_file_checksum: element.avatar_file_checksum,
                                avatar_contraction_data: element.avatar_contraction_data,
                                avatar_type: type,
                                avatar_obid: element._id
                            };
                            user_array.push(user_data)
                        });
        
                        send_data = {
                            stb_sn: json.stb_sn,
                            values: user_array
                        };
                        client.publish('/access/request/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
        
                        let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 5, log_message: 'access_request', create_dt: json.create_time });
                        newGlogs.save(function (error, data) {
                            if (error) {
                                console.log(error);
                            }
                        });
                    }
                })
            }
        })
    },

    async access_request_result_result(json) {
        await Camera.findOne( { serial_number : json.stb_sn }, (err, camera) => {
            if (err) {
                console.log(err);
            }else{
                let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 6, log_message: 'access_request_success', create_dt: json.create_time });
                newGlogs.save(function (error, data) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        })
    },

    async access_realtime(json) {
        try {
            let insert_array = [];
            let camera = await Camera.findOne( { serial_number : json.stb_sn });

            let empCnt = 0;
            let visitorCnt = 0;
            let blackCnt = 0;
            let strangerCnt = 0;
            
            json.values.forEach(function(element){
                let folder_date_path = "/uploads/accesss/temp/" + moment().format('YYYYMMDD');
                let file_name = json.stb_sn + "_" + moment().format('YYYYMMDDHHmmss') + ".png";
                //let upload_file_path = site.base_server_document + folder_date_path;
                let file_path = site.base_server_document + folder_date_path + "/" + json.stb_sn + "/";
                let upload_url = site.base_local_url+ ':3000' + folder_date_path + "/" + json.stb_sn + "/" + file_name;
                let buff = Buffer.from(element.avatar_file, 'base64');
                element.avatar_obid = '5ee9db4360497f4ee3dd0f4f'
                if(element.avatar_type === 1) {
                    empCnt++;
                } else if(element.avatar_type === 2) {
                    visitorCnt++;
                } else if(element.avatar_type === 3) {
                    strangerCnt++;
                } else if(element.avatar_type === 4) {
                    blackCnt++;
                }
                
                mkdirp.sync(file_path);
                fs.promises.writeFile(file_path + file_name, buff, 'utf-8')
                if(element.avatar_obid === ""){
                    insert_data = {
                        avatar_file : element.avatar_file,
                        avatar_file_checksum : element.avatar_file_checksum,
                        avatar_type : element.avatar_type,
                        avatar_contraction_data : element.avatar_contraction_data,
                        avatar_file_url : upload_url,
                        avatar_temperature : element.avatar_temperature,
                        access_time : moment().format('YYYY-MM-DD HH:mm:ss'),
                        stb_sn : json.stb_sn,
                        stb_obid : camera._id
                    };
                }else{
                    insert_data = {
                        avatar_file : element.avatar_file,
                        avatar_file_checksum : element.avatar_file_checksum,
                        avatar_type : element.avatar_type,
                        avatar_contraction_data : element.avatar_contraction_data,
                        avatar_file_url : upload_url,
                        user_obid : element.avatar_obid, 
                        avatar_temperature : element.avatar_temperature,
                        access_time : moment().format('YYYY-MM-DD HH:mm:ss'),
                        stb_sn : json.stb_sn,
                        stb_obid : camera._id
                    };
                }
                //new mongoose.Types.ObjectId()
                insert_array.push(insert_data);
            })
            
            let accessData = await Access.insertMany(insert_array)
            
            let todayStatistics = await Statistics.findOne()
                .where('camera_obid').equals(camera._id)
                .where('reference_date').equals(moment().format('YYYY-MM-DD'));
            
            if(todayStatistics === null) {
                todayStatistics = new Statistics({
                    camera_obid : camera._id,
                    reference_date: moment().format('YYYY-MM-DD'),
                    all_count: empCnt+visitorCnt+strangerCnt+blackCnt,
                    employee_count : empCnt,
                    guest_count : visitorCnt,
                    stranger_count : strangerCnt,
                    blacklist_count : blackCnt,
                })
                todayStatistics.save()
            } else {
                await Statistics.findByIdAndUpdate(todayStatistics._id,{ 
                    $inc: { 
                        all_count: empCnt+visitorCnt+strangerCnt+blackCnt,
                        employee_count : empCnt,
                        guest_count : visitorCnt,
                        stranger_count : strangerCnt,
                        blacklist_count : blackCnt
                    },
                    $push: { 
                        statistics_obids: accessData[0] 
                    } 
                },
                {
                    
                })
            }

            send_data = {
                stb_sn: json.stb_sn,
                values: insert_array
            };
            client.publish('/access/realtime/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);

            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 7, log_message: 'realtime_access', create_dt: json.create_time });
            newGlogs.save(function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    },

    async access_addpeople(json) {
        try{
            let insert_array = [];
            let camera = await Camera.findOne( { serial_number : json.stb_sn });
            
            json.values.forEach(function(element){
                let folder_date_path = "/uploads/user/" + moment().format('YYYYMMDD');
                let file_name = element.avatar_name + "_" + moment().format('YYYYMMDDHHmmss') + ".png";
                //let upload_file_path = site.base_server_document + folder_date_path;
                let file_path = site.base_server_document + folder_date_path + "/";
                let upload_url = site.base_local_url+ ':3000' + folder_date_path + "/" + file_name;
                let buff = Buffer.from(element.avatar_file, 'base64');
                
                mkdirp.sync(file_path);
                
                fs.promises.writeFile(file_path + file_name, buff, 'utf-8')
                
                insert_data = {
                    avatar_file : element.avatar_file,
                    avatar_file_checksum : element.avatar_file_checksum,
                    avatar_contraction_data : element.avatar_contraction_data,
                    avatar_file_url : upload_url,
                    avatar_type : element.avatar_type,
                    name : element.avatar_name,
                    create_at : moment().format('YYYY-MM-DD'),
                    create_ut : Date.now(),
                    action : '생성'
                };

                insert_array.push(insert_data);
            })

            await User.insertMany(insert_array)
            
            send_data = {
                stb_sn: json.stb_sn
            };
            client.publish('/access/addpeople/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);

            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 8, log_message: 'add_people', create_dt: json.create_time });
            newGlogs.save(function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        } catch (error){
            console.log(error);
        }
    },

    async control_log_result(json) {
        try{
            let camera = await Camera.findOne( { serial_number : json.stb_sn });
            
            let folder_date_path = "/uploads/logs/" + moment().format('YYYYMMDD');
            let file_name = json.filename;
            let file_path = site.base_server_document + folder_date_path + "/";
            //let upload_url = site.base_local_url + folder_date_path + "/" + file_name;
            let buff = Buffer.from(json.data, 'base64');
            mkdirp.sync(file_path);
            fs.promises.writeFile(file_path + file_name, buff, 'utf-8')
            
            // send_data = {
            //     stb_sn: json.stb_sn
            // };
            // client.publish('/access/addpeople/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);

            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 10, log_message: 'control_log_result', create_dt: json.create_time });
            newGlogs.save(function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        } catch (error){
            console.log(error);
        }
    },

    async control_capture_start_result(json) {
        try{
            let camera = await Camera.findOne( { serial_number : json.stb_sn });
            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 11, log_message: 'capture_start', create_dt: json.create_time });
            newGlogs.save(function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        } catch (error){
            console.log(error);
        }
    },

    async control_capture_upload(json) {
        try {
            let camera = await Camera.findOne( { serial_number : json.stb_sn });
            let folder_date_path = "/uploads/monitor/" + moment().format('YYYYMMDD');
            let file_name = json.stb_sn + "_" + moment().format('YYYYMMDDHHmmss') + ".png";
            //let upload_file_path = site.base_server_document + folder_date_path;
            let file_path = site.base_server_document + folder_date_path + "/" + json.stb_sn + "/";
            let upload_url = site.base_local_url+ ':3000' + folder_date_path + "/" + json.stb_sn + "/" + file_name;
            let buff = Buffer.from(json.data, 'base64');
            mkdirp.sync(file_path);
            fs.promises.writeFile(file_path + file_name, buff, 'utf-8')

            
            imageInfo(file_path + file_name, (err, image_info) => {
                insert_data = {
                    camera_obids : camera._id,
                    serial_number : camera.serial_number,
                    name : camera.name,
                    location : camera.location,
                    sha1_value : image_info.sha1,
                    upload_url : upload_url,
                    width : image_info.width,
                    height : image_info.height,
                    filesize : image_info.bytes,
                    filename : file_name,
                    create_dt : json.create_time,
                };
                
                Camera_monitor.insertMany(insert_data)
                send_data = {
                    stb_sn: json.stb_sn,
                    stb_id: camera.name,
                    result: "ok"
                };
                client.publish('/control/capture/upload/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
            });
        } catch (error) {
            console.log(error);
        }
    },

    async control_capture_end_result(json) {
        try{
            let camera = await Camera.findOne( { serial_number : json.stb_sn });
            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 12, log_message: 'capture_stop', create_dt: json.create_time });
            newGlogs.save(function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        } catch (error){
            console.log(error);
        }
    },

    async control_sdcard_delete_result(json) {
        try{
            let camera = await Camera.findOne( { serial_number : json.stb_sn });
            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 13, log_message: 'sdcard_delete', create_dt: json.create_time });
            newGlogs.save(function (error, data) {
                if (error) {
                    console.log(error);
                }
            });

            send_data = {
                stb_sn: camera.serial_number,
                message: "get_device_file_list"
            };
            client.publish('/control/get_device_file_list/' + camera.serial_number, JSON.stringify(send_data), mqtt_option);
        } catch (error){
            console.log(error);
        }
    },

    async control_sdcard_part_delete_result(json) {
        try{
            let camera = await Camera.findOne( { serial_number : json.stb_sn });
            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 15, log_message: 'part_sdcard_delete', create_dt: json.create_time });
            newGlogs.save(function (error, data) {
                if (error) {
                    console.log(error);
                }
            });

            send_data = {
                stb_sn: camera.serial_number,
                message: "get_device_file_list"
            };
            client.publish('/control/get_device_file_list/' + camera.serial_number, JSON.stringify(send_data), mqtt_option);
        } catch (error){
            console.log(error);
        }
    },

    async control_reboot_result(json) {
        try{
            let camera = await Camera.findOne( { serial_number : json.stb_sn });
            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 16, log_message: 'reboot_success', create_dt: json.create_time });
            newGlogs.save(function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        } catch (error){
            console.log(error);
        }
    },

    async control_get_device_file_list_result(json) { 
        try{
            camera = await Camera.findOne( { serial_number : json.stb_sn });
        } catch (error){
            console.log(error);
        }

        let file_list = [];

        if (Array.isArray(json.value)) {
            json.value.forEach((flist) => {
                file_data = {
                    camera_obids : camera._id,
                    serial_number : json.stb_sn,
                    file_name : flist.name,
                    file_size : flist.size,
                    status : flist.Usage_status,
                    file_date : flist.date,
                    create_dt : json.create_time
                };
                file_list.push(file_data);
            })
        }

        try {
            //let delete_original = await 
            await Camera_filelist.deleteMany({ 
                camera_obids : camera._id 
            });
            await Camera_filelist.insertMany(file_list);

        } catch (error) {
            console.log(error);
        }
    },

    async control_reset_result(json) {
        try{
            let camera = await Camera.findOne( { serial_number : json.stb_sn });
            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 24, log_message: 'stb_reset', create_dt: json.create_time });
            newGlogs.save(function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        } catch (error){
            console.log(error);
        }
    },

    async control_temperature_result(json) {
        // try{
        //     let camera = await Camera.findOne( { serial_number : json.stb_sn });
        //     let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 24, log_message: 'stb_reset', create_dt: json.create_time });
        //     newGlogs.save(function (error, data) {
        //         if (error) {
        //             console.log(error);
        //         }
        //     });
        // } catch (error){
        //     console.log(error);
        // }
    },

    async control_device_info(json) {
        try{
            let camera = await Camera.findOne({ serial_number : json.stb_sn });
            camera.status = "Y";
            camera.info_update_time = moment().format('YYYY-MM-DD HH:mm:ss');
            if(json.value.mac_addr) camera.config_data.mac_address = json.value.mac_addr;
            if(json.value.hdd_total) camera.config_data.hdd_total = json.value.hdd_total;
            if(json.value.hdd_used) camera.config_data.hdd_used = json.value.hdd_used;
            if(json.value.stb_version) camera.app_version = json.value.stb_version;
            if(json.value.stb_ip) camera.ip = json.value.stb_ip;
            camera.save( (err) => {
                if(err){
                    console.log(err);
                } else{
                    send_data = {
                        stb_sn: camera.serial_number
                    };
                    client.publish('/control/device_info/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
                }
            });
            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 29, log_message: 'control_device_info', create_dt: json.create_time });
            newGlogs.save(function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    },

    async control_rrd(json) {
        try{
            camera = await Camera.findOne( { serial_number : json.stb_sn });
        } catch (error){
            console.log(error);
        }
        let value = json.value;
        let send_data;

        if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                let rrd_value = value[i];
                let nowDate = new Date(Number(rrd_value.time));

                let cpu = rrd_value.cpu;
                let network = rrd_value.network;
                let disk = rrd_value.disk;

                //console.log(rrd_value);

                // softirq가 없이 오는 경우가 있다. (단말 이슈)
                if (!isNaN(Number(cpu.idle)) &&
                    !isNaN(Number(cpu.nice)) &&
                    !isNaN(Number(cpu.usr)) &&
                    !isNaN(Number(cpu.softirq)) &&
                    !isNaN(Number(cpu.irq)) &&
                    !isNaN(Number(cpu.io)) &&
                    !isNaN(Number(cpu.sys))
                ) {
                    influxQueue.push({
                        measurement: json.stb_sn + '_cpu',
                        //tags: {
                        //    serial_number: json.stb_sn
                        //},
                        fields: {
                            idle: Number(cpu.idle),
                            nice: Number(cpu.nice),
                            usr: Number(cpu.usr),
                            softirq: Number(cpu.softirq),
                            irq: Number(cpu.irq),
                            io: Number(cpu.io),
                            sys: Number(cpu.sys)
                        },
                        timestamp: nowDate
                    });
                } else console.log("CPU DATA ERROR!");

                if (!isNaN(Number(network.in)) &&
                    !isNaN(Number(network.out))
                ) {
                    influxQueue.push({
                        measurement: json.stb_sn + '_network',
                        //tags: {
                        //    serial_number: json.stb_sn
                        //},
                        fields: {
                            in: Number(network.in),
                            out: Number(network.out)
                        },
                        timestamp: nowDate
                    });
                } else console.log("NETWORK DATA ERROR!");

                if (!isNaN(Number(disk.BytesUsed)) &&
                    !isNaN(Number(disk.BytesAvailable))
                ) {
                    influxQueue.push({
                        measurement: json.stb_sn + '_disk',
                        //tags: {
                        //    serial_number: json.stb_sn
                        //},
                        fields: {
                            available: Number(disk.BytesAvailable),
                            used: Number(disk.BytesUsed),
                            util: Number(disk.BytesAvailable) + Number(disk.BytesUsed)
                        },
                        timestamp: nowDate
                    });
                } else console.log("DISK DATA ERROR!");
            }
        } else {
            console.log("RRD Value is not array.");
            let rrd_value = value;
            let nowDate = new Date();

            let cpu = rrd_value.cpu[0];
            let network = rrd_value.network[0];
            let disk = rrd_value.disk[0];

            if (!isNaN(Number(cpu.idle)) &&
                !isNaN(Number(cpu.nice)) &&
                !isNaN(Number(cpu.usr)) &&
                !isNaN(Number(cpu.softirq)) &&
                !isNaN(Number(cpu.irq)) &&
                !isNaN(Number(cpu.io)) &&
                !isNaN(Number(cpu.sys))
            ) {
                influxQueue.push({
                    measurement: json.stb_sn + '_cpu',
                    //tags: {
                    //    serial_number: json.stb_sn
                    //},
                    fields: {
                        idle: cpu.idle,
                        nice: cpu.nice,
                        usr: cpu.usr,
                        softirq: cpu.softirq,
                        irq: cpu.irq,
                        io: cpu.io,
                        sys: cpu.sys
                    },
                    timestamp: nowDate
                });
            }

            if (!isNaN(Number(network.in)) &&
                !isNaN(Number(network.out))
            ) {
                influxQueue.push({
                    measurement: json.stb_sn + '_network',
                    //tags: {
                    //    serial_number: json.stb_sn
                    //},
                    fields: {
                        in: network.in,
                        out: network.out
                    },
                    timestamp: nowDate
                });
            }

            if (!isNaN(Number(disk.BytesUsed)) &&
                !isNaN(Number(disk.BytesAvailable))
            ) {
                influxQueue.push({
                    measurement: json.stb_sn + '_disk',
                    //tags: {
                    //    serial_number: json.stb_sn
                    //},
                    fields: {
                        available: disk.BytesAvailable,
                        used: disk.BytesUsed,
                        util: disk.BytesAvailable + disk.BytesUsed
                    },
                    timestamp: nowDate
                });
            }
        }

        send_data = {
            stb_sn: camera.serial_number
        };
        client.publish('/control/rrd/result/' + camera.serial_number, JSON.stringify(send_data), mqtt_option);

        let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: 30, log_message: 'control_rrd', create_dt: json.create_time });
        newGlogs.save(function (error, data) {
            if (error) {
                console.log(error);
            }
        });
    },

    async log_status(json) {
        try{
            let camera = await Camera.findOne( { serial_number : json.stb_sn });

            switch (json.message) {
                case 'sdcard_check':
                    var log_no = 31;
                    var log_message = 'sdcard_check';
                    break;
                case 'cpu_used_high_resource':
                    var log_no = 32;
                    var log_message = 'cpu_used_high_resource';
                    break;
                case 'memory_used_high_resource':
                    var log_no = 33;
                    var log_message = 'memory_used_high_resource';
                    break;
            }

            send_data = {
                stb_sn: camera.serial_number,
                message : log_message
            };
            client.publish('/log/status/result/' +  camera.serial_number, JSON.stringify(send_data), mqtt_option);

            let newGlogs = new glogs({ stb_id: camera.name, stb_sn: camera.serial_number, log_no: log_no, log_message: log_message, create_dt: json.create_time });
            newGlogs.save(function (error, data) {
                if (error) {
                    console.log(error);
                }
            });
        } catch (error){
            console.log(error);
        }
    },
}