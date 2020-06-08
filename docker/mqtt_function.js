const fs = require("fs");
const path = require('path');
const site_info_json = fs.readFileSync(path.join(__dirname, "./cloud40.json"));
const site = JSON.parse(site_info_json);
const imageInfo = require('image-info');
const moment = require('moment');
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

mongoose.connect('mongodb://' + site.mongodb_host + ':27017/' + site.mongodb_database + '?poolSize=4', { useNewUrlParser: true, useUnifiedTopology: true });

const Access = require('./schema/access_Schema');
const Camera = require('./schema/camera_Schema');
const Gateway = require('./schema/gateway_Schema');
const Group = require('./schema/group_Schema');
const Statistics = require('./schema/statistics_Schema');
const User = require('./schema/user_Schema');
const Version = require('./schema/version_Schema');


let newVersion = new Version({ user_obid: 'N', stb_id: 'result[0].name', stb_sn: 'result[0].serial_number', log_no: 1, log_message: 'login', create_dt: 'update_time', regdate: 'update_time' });
    newVersion.save(function (error, data) {
        if (error) {
            console.log(error);
        }
    });


const glogs = mongoose.Schema({
    process_status: 'string',
    stb_id: 'string',
    stb_sn: 'string',
    log_no: 'number',
    log_message: 'string',
    create_dt: 'string',
    regdate: 'string'
});
const Glogs = mongoose.model('g_logs', glogs);

const vipglogs = mongoose.Schema({
    process_status: 'string',
    stb_id: 'string',
    stb_sn: 'string',
    log_no: 'number',
    log_message: 'string',
    create_dt: 'string',
    regdate: 'string'
});
const vipGlogs = mongoose.model('g_viplogs', vipglogs);

const gcontents = mongoose.Schema({
    process_status: 'string',
    stb_id: 'string',
    stb_sn: 'string',
    contents_uid: 'number',
    contents_frame: 'number',
    contents_name: 'string',
    end_time: 'number',
    start_time: 'number',
    duration: 'number',
    create_dt: 'string',
    regdate: 'string'
});
const Gcontents = mongoose.model('g_monitor_contents', gcontents);

module.exports = {
    login(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        send_data = {
            stb_sn: json.stb_sn,
            message: "login",
            result: "ok",
            stb_id: "dummy",
            capture_option : {
                capture_time: "",
                capture_size: "",
                capture_status: ""
            }
        };
        client.publish('/login/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
        /*
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, stb_type, `name`, serial_number, distribute_uid, tv_close_day, tv_close_start, tv_close_end, tv_type, tv_control, tv_sub_control, tv_volume, tv_input, tv_input_time, capture_time, capture_size, capture_status, sync_status, sync_string,relay_address, relay_port FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
                            conn.query("update `stb` set network_status=?, mac_address=?, app_version=?, ip_address=?, info_update_time=? where serial_number=?", ['Y', json.stb_mac, json.stb_version, json.stb_ip, update_time, json.stb_sn])
                                .then(rows => {
                                    //conn.release();
                                    
                                    if(result[0].capture_status == 'Y') {
                                        send_data = {
                                            stb_sn: result[0].serial_number,
                                            message: "login",
                                            result: "ok",
                                            stb_id: result[0].name,
                                            last_schedule: result[0].distribute_uid,
                                            capture_option : {
                                                capture_time: result[0].capture_time,
                                                capture_size: result[0].capture_size,
                                                capture_status: result[0].capture_status
                                            }
                                        };
                                    }else{
                                        send_data = {
                                            stb_sn: result[0].serial_number,
                                            message: "login",
                                            result: "ok",
                                            stb_id: result[0].name,
                                            last_schedule: result[0].distribute_uid,
                                            capture_option : ""
                                        };
                                    }
                                    client.publish('/login/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);

                                    if(result[0].stb_type == 'cloud3_relay'){
                                        if(result[0].relay_address !== null && result[0].relay_port !== null){
                                            let relay_array = {
                                                port: result[0].relay_port,
                                                multicast: result[0].relay_address
                                            }

                                            relay_data = {
                                                stb_sn: result[0].serial_number,
                                                value: [relay_array]
                                            }
                                            client.publish('/control/relay/setting/' + json.stb_sn, JSON.stringify(relay_data), mqtt_option);
                                        }
                                    }else{
                                        if(result[0].sync_status == 'Y' && result[0].sync_string !== null){
                                            sync_data = {
                                                stb_sn: result[0].serial_number,
                                                values: result[0].sync_string
                                            }
                                            client.publish('/setting/sync/start/' + json.stb_sn, JSON.stringify(sync_data), mqtt_option);
                                        }else{
                                            sync_data = {
                                                stb_sn: result[0].serial_number
                                            }
                                            client.publish('/setting/sync/end/' + json.stb_sn, JSON.stringify(sync_data), mqtt_option);
                                        }
                                        
                                        if(result[0].tv_type !== null && result[0].tv_control !== null){
                                            tv_setting_data = {
                                                stb_sn: result[0].serial_number,
                                                msg: "tvcontrol",
                                                status:"tvset",
                                                vendor: result[0].tv_type,
                                                control: result[0].tv_control,
                                                type: result[0].tv_sub_control,
                                                stb_gubun: ""
                                            }
                                            client.publish('/control/tv/' + json.stb_sn, JSON.stringify(tv_setting_data), mqtt_option);
                                        }
                                        
                                        if(result[0].tv_type !== null && result[0].tv_control !== null && result[0].tv_close_day !== 'N;' && result[0].tv_on !== null && result[0].tv_off !== null){
                                            let tv_close_day = "";
                                            temp_close_day = unserialize(result[0].tv_close_day);
                                            for(let z=0; z< 7; z++) {
                                                if(temp_close_day[z] !== null && temp_close_day[z] !== undefined){
                                                    tv_close_day = tv_close_day + temp_close_day[z] + ",";
                                                }
                                            }
                                            tv_close = tv_close_day.substr(0, (tv_close_day.length-1));

                                            on_off_data = {
                                                stb_sn: result[0].serial_number,
                                                msg: "tvonoff",
                                                vendor: result[0].tv_type,
                                                control: result[0].tv_control,
                                                type: result[0].tv_sub_control,
                                                tv_day: tv_close,
                                                tv_on: result[0].tv_close_start,
                                                tv_off: result[0].tv_close_end
                                            }
                                            client.publish('/control/tv/reservation/onoff/' + json.stb_sn, JSON.stringify(on_off_data), mqtt_option);
                                        }
    
                                        if(result[0].tv_input !== null && result[0].tv_input_time !== null){
                                            input_data = {
                                                stb_sn: result[0].serial_number,
                                                value: result[0].tv_input,
                                                msg: "tvinput",
                                                regdate: result[0].tv_input_time
                                            }
                                            client.publish('/control/tv_input/' + json.stb_sn, JSON.stringify(input_data), mqtt_option);
                                        }
                                    }

                                    //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                                    let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 1, log_message: 'login', create_dt: update_time, regdate: update_time });
                                    newGlogs.save(function (error, data) {
                                        if (error) {
                                            console.log(error);
                                        }
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        } else {
                            send_data = {
                                stb_sn: json.stb_sn,
                                message: "login",
                                result: "fail"
                            };
                            client.publish('/login/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
        */
    },

    login_fail(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("insert into stb_login_fail(serial_number, regdate) values(?,?)", [json.stb_sn, update_time])
                    .then(rows => {
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    logout(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
                            conn.query("update `stb` set network_status=? where serial_number=?", ['N', json.stb_sn])
                                .then(rows => {
                                    //conn.release();

                                    /*
                                    send_data = {
                                        stb_sn: result[0].serial_number,
                                        stb_id: result[0].stb_id,
                                        message: "logout",
                                        result: "ok"
                                    };
                                    client.publish('/logout/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
                                    */
                                    //TODO:단말에 추가로 해당 발생된 시간이 나와야함 create_dt가 발생된 시간, regdate 가 서버에 등록된 시간으로 변경 
                                    let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 2, log_message: 'logout', create_dt: update_time, regdate: update_time });
                                    newGlogs.save(function (error, data) {
                                        if (error) {
                                            console.log(error);
                                        }
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }else {
                            //conn.release();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    disconnect_result(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number, vip_status FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
                            conn.query("update `stb` set network_status=? where serial_number=?", ['N', json.stb_sn])
                                .then(rows => {
                                    //conn.release();
                                    //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                                    let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].stb_id, stb_sn: json.stb_sn, log_no: 3, log_message: 'disconnect', create_dt: update_time, regdate: update_time });
                                    newGlogs.save(function (error, data) {
                                        if (error) {
                                            console.log(error);
                                        }
                                    });
                                    //TODO:  SMS 송출
                                    if(result[0].vip_status == "Y") {
                                        let newvipGlogs = new vipGlogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 3, log_message: 'disconnect', create_dt: update_time, regdate: update_time });
                                        newvipGlogs.save(function (error, data) {
                                            if (error) {
                                                console.error(error.message);
                                            }
                                        });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    download(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        //console.log('download 처리 시작');
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number, distribute_uid, id FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        //console.log('result: ', result[0]);
                        //console.log('json: ', json);
                        if (result[0].cnt > 0) {

                            let total_progress;
                            let is_updated = false;

                            // 디스트리뷰트 추가
                            //console.log('디스트리뷰트 처리 시작');
                            getConnectionDummy()
                                .then(conn => {
                                    conn.query("update `distribute_settop_list` set download_progress=?, download_complete=?, download_speed=?, status=?, updated_at=?, updated_ut=? where distribute_uid = ? and stb_id = ? and status = 'start' and is_overwrited = 0", [
                                        json.percent, (json.percent == 100 ? 1 : 0), json.speed, (json.percent == 100 ? 'done' : 'start'), update_time, Math.floor(Date.now() / 1000), result[0].distribute_uid, result[0].id, 
                                    ]).then(rows => {
                                        if (rows.affectedRows > 0) is_updated = true;
                                        //console.log('distribute_settop_list Download 업데이트함.');
                                        return sleep(100);
                                    }).then(() => {
                                        // 100ms만 대기한다. (update 반영을 기다림)
                                        return conn.query("SELECT SUM(IF(is_overwrited = 1, 100, IF(status = 'cancel', 100, download_progress))) AS total_download_progress, COUNT(uid) as stb_count FROM distribute_settop_list WHERE distribute_uid = ?", [result[0].distribute_uid]);
                                    }).then(distribute_result => {
                                        //console.log('distribute_result: ', distribute_result);
                                        total_progress = distribute_result[0].total_download_progress / distribute_result[0].stb_count;
                                        //console.log('total progoress: ', total_progress);
                                        if (total_progress == 100) {
                                            return conn.query("UPDATE distribute_list SET distribute_status = 'end', is_pausable = 0, distribute_download_progress = ?, distribute_download_complete = ?, updated_at=?, updated_ut=? WHERE uid = ?", [
                                                total_progress, 1, update_time, Math.floor(Date.now() / 1000), result[0].distribute_uid
                                            ]);
                                        }else {
                                            return conn.query("UPDATE distribute_list SET distribute_download_progress = ?, distribute_download_complete = ?, updated_at=?, updated_ut=? WHERE uid = ?", [
                                                total_progress, 0, update_time, Math.floor(Date.now() / 1000), result[0].distribute_uid
                                            ]);
                                        }
                                    }).then(rows => {
                                        //console.log('Distribute download 완료.');
                                        //conn.release();

                                        send_data = {
                                            uid: result[0].distribute_uid,
                                            percent: total_progress
                                        };
                                        client.publish('/live/distribute/download', JSON.stringify(send_data), mqtt_option);

                                        if (is_updated) {
                                            send_data = {
                                                uid: result[0].distribute_uid,
                                                stb_id: result[0].id,
                                                percent: json.percent,
                                                speed: json.speed
                                            };
                                            client.publish('/live/distribute/download/settop', JSON.stringify(send_data), mqtt_option);
                                        }

                                    }).catch(err => {
                                        //conn.release();
                                        console.log(err);
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                });

                            if (json.percent > 95) {

                                getConnectionDummy()
                                    .then(conn => {
                                        conn.query("update `stb` set network_status=?,download_current=? where serial_number=?", ['Y', 100, json.stb_sn])
                                            .then(rows => {
                                                //conn.release();
                                                send_data = {
                                                    stb_sn: json.stb_sn,
                                                    percent: json.percent,
                                                    message: "download"
                                                };
                                                client.publish('/download/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
                                            })
                                            .catch(err => {
                                                //conn.release();
                                                console.log(err);
                                            });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });

                                /*getConnectionDummy()
                                    .then(conn => {
                                        conn.query("update g_send_contents_order set status=?, download_end=? where serial_number=?", ['Y', update_time, json.stb_sn])
                                            .then(rows => {
                                                //conn.release();
                                            })
                                            .catch(err => {
                                                //conn.release();
                                                console.log(err);
                                            });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });*/
                                //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                                let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 4, log_message: 'contents_down_success', create_dt: update_time, regdate: update_time });
                                newGlogs.save(function (error, data) {
                                    if (error) {
                                        console.error(error.message);
                                    }
                                });
                            } else {
                                getConnectionDummy()
                                    .then(conn => {
                                        conn.query("update `stb` set network_status=?,download_current=? where serial_number=?", ['Y', json.percent, json.stb_sn])
                                            .then(rows => {
                                                //conn.release();
                                            })
                                            .catch(err => {
                                                //conn.release();
                                                console.log(err);
                                            });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            }
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    access_request(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        //console.log('download 처리 시작');
        send_data = {
            stb_sn: json.stb_sn
        };
        client.publish('/access/request/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
    },

    access_request_result_result(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        //console.log('download 처리 시작');
    },

    access_realtime(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        //console.log('download 처리 시작');
        send_data = {
            stb_sn: json.stb_sn
        };
        client.publish('/access/realtime/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
    },

    access_addpeople(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        //console.log('download 처리 시작');
        send_data = {
            stb_sn: json.stb_sn
        };
        client.publish('/access/addpeople/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
    },

    control_log_result(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
                            let data = json.data;
                            // let buff = new Buffer(data, 'base64'); new Buffer is deprecated
                            let buff = Buffer.from(data, 'base64');
                            let file_name = json.filename;
                            let file_path = site.base_server_document + "/uploads/log/" + file_name;

                            fs.writeFileSync(file_path, buff);
                            //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                            let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 10, log_message: 'control_log_result', create_dt: update_time, regdate: update_time });
                            newGlogs.save(function (error, data) {
                                if (error) {
                                    console.log(error);
                                }
                            });
                            //TODO: 보낸 것에 대한 리턴 처리구현 + 몽고 캐시 삭제
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    control_capture_start_result(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
                            //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                            let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 11, log_message: 'capture_start', create_dt: update_time, regdate: update_time });
                            newGlogs.save(function (error, data) {
                                if (error) {
                                    console.error(error.message);
                                }
                            });
                            //TODO: 보낸 것에 대한 리턴 처리구현 + 몽고 캐시 삭제
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    control_capture_upload(json) {
        let folder_date_path = "/uploads/monitor/" + moment().format('YYYYMMDD');
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number, user_id, parent_id1, parent_id2, parent_id3, location FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        //conn.release();
                        if (result[0].cnt > 0) {
                            let data = json.data;
                            //let buff = new Buffer(data, 'base64');
                            let buff = Buffer.from(data, 'base64');
                            let file_name = json.stb_sn + "_" + moment().format('YYYYMMDDHHmmss') + ".png";
                            let upload_file_path = site.base_server_document + folder_date_path;
                            let file_path = site.base_server_document + folder_date_path + "/" + json.stb_sn + "/";
                            let upload_url = site.base_local_url + folder_date_path + "/" + json.stb_sn + "/" + file_name;

                            if (!fs.existsSync(upload_file_path)) {
                                fs.mkdirSync(upload_file_path);
                            }
                            if (!fs.existsSync(file_path)) {
                                fs.mkdirSync(file_path);
                            }

                            fs.writeFile(file_path + file_name, buff, 'utf-8', function(err,file_result){
                                if(err) console.log('file_error' , err);
                                imageInfo(file_path + file_name, (err, info) => {
                                    if (err) return console.warn(err);
                                    image_info = info;
                                    var insert = "insert into stb_monitor_screen (serial_number, name, user_id, parent_id1, parent_id2, parent_id3, location, md5_value, upload_url, width, height, filesize, filename, update_time, regdate ) " +
                                        "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
                                    var params = [result[0].serial_number, result[0].name, result[0].user_id, result[0].parent_id1, result[0].parent_id2, result[0].parent_id3, result[0].location, image_info.sha1, upload_url, image_info.width, image_info.height, image_info.bytes, file_name, moment().unix(), update_time];
                                    conn.query(insert, params) 
                                        .then(insert_result=>{
                                            //conn.release();
                                            conn.query("SELECT count(*) as cnt, name, user_id FROM stb_monitor_last_screen where serial_number=?", result[0].serial_number) 
                                                .then(internal_result=>{
                                                    //conn.release();
                                                    
                                                    if (internal_result[0].cnt > 0) {
                                                        var update = "update stb_monitor_last_screen set upload_url=?,  md5_value=?, width=?, height=?, filesize=?, filename=?, update_time=? where serial_number=?";
                                                        var params = [upload_url, image_info.sha1, image_info.width, image_info.height, image_info.bytes, file_name, moment().unix(), result[0].serial_number];
                                                        conn.query(update, params) 
                                                        .then(internal_return=>{
                                                            
                                                        })
                                                        .catch(err =>{
                                                            console.log(err);
                                                        });
                                                    } else {
                                                        var insert = "insert into stb_monitor_last_screen (status, serial_number, name, user_id, parent_id1, parent_id2, parent_id3, location, md5_value, upload_url, width, height, filesize, filename, update_time, regdate ) " +
                                                            "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
                                                        var params = ['Y', result[0].serial_number, result[0].name, result[0].user_id, result[0].parent_id1, result[0].parent_id2, result[0].parent_id3, result[0].location, image_info.sha1, upload_url, image_info.width, image_info.height, image_info.bytes, file_name, moment().unix(), update_time];
                                                        conn.query(insert, params) 
                                                            .then(internal_return=>{

                                                            })
                                                            .catch(err => {
                                                                console.log(err);
                                                            });
                                                            //conn.release();
                                                    }
                                                })
                                                .catch(err =>{
                                                    console.log(err);
                                                });
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                });
                            });

                            send_data = {
                                stb_sn: result[0].serial_number,
                                stb_id: result[0].name,
                                result: "ok"
                            };
                            client.publish('/control/capture/upload/result/' + json.stb_sn, JSON.stringify(send_data), mqtt_option);
                            //TODO: 보낸 것에 대한 리턴 처리구현 + 몽고 캐시 삭제
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(err => {
                console.log(err);  
            })
    },

    control_capture_end_result(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
                            //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                            let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 12, log_message: 'capture_stop', create_dt: update_time, regdate: update_time });
                            newGlogs.save(function (error, data) {
                                if (error) {
                                    console.error(error.message);
                                }
                            });
                            //TODO: 보낸 것에 대한 리턴 처리구현 + 몽고 캐시 삭제
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    control_sdcard_delete_result(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
                            //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                            let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 13, log_message: 'sdcard_delete', create_dt: update_time, regdate: update_time });
                            newGlogs.save(function (error, data) {
                                if (error) {
                                    console.error(error.message);
                                }
                            });

                            send_data = {
                                stb_sn: result[0].serial_number,
                                message: "get_device_file_list"
                            };
                            client.publish('/control/get_device_file_list/' + result[0].serial_number, JSON.stringify(send_data), mqtt_option);
                            //TODO: 보낸 것에 대한 리턴 처리구현 + 몽고 캐시 삭제
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    control_sdcard_part_delete_result(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
                            //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                            let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 15, log_message: 'part_sdcard_delete', create_dt: update_time, regdate: update_time });
                            newGlogs.save(function (error, data) {
                                if (error) {
                                    console.error(error.message);
                                }
                            });
                            send_data = {
                                stb_sn: result[0].serial_number,
                                message: "get_device_file_list"
                            };
                            client.publish('/control/get_device_file_list/' + result[0].serial_number, JSON.stringify(send_data), mqtt_option);
                            //TODO: 보낸 것에 대한 리턴 처리구현 + 몽고 캐시 삭제
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    control_reboot_result(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
                            //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                            let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 16, log_message: 'reboot_success', create_dt: update_time, regdate: update_time });
                            newGlogs.save(function (error, data) {
                                if (error) {
                                    console.error(error.message);
                                }
                            });
                            //TODO: 보낸 것에 대한 리턴 처리구현 + 몽고 캐시 삭제
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    async control_get_device_file_list_result(json) { 
        let conn;

        try {
            conn = await pool.getConnection();
        } catch (error) {
            console.log("conn error");
            return;
        }

        let file_list = [];

        if (Array.isArray(json.value)) {
            json.value.forEach((flist) => {
                let flist_array = [];

                flist_array.push(flist.Usage_status);
                flist_array.push(json.stb_sn);
                flist_array.push(flist.name);
                flist_array.push(flist.size);
                flist_array.push(flist.date);

                file_list.push(flist_array);
            })
        }

        try {
            await conn.beginTransaction();
        } catch (error) {
            console.log("beginTransaction error");
            conn.release();
            return;
        }

        try {
            let delete_original = await conn.query("DELETE FROM `stb_file_list` where serial_number=?", json.stb_sn);
            let result = await conn.batch("insert into `stb_file_list` ( status, serial_number, file_name, file_size, file_date ) values (?,?,?,?,?)", file_list);
            await conn.commit();
        } catch (error) {
            try {
                await conn.rollback();
            } catch (error) {
                console.log("beginTransaction error");
                console.log(error);
            }
        }

        conn.release();
    },

    control_reset_result(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
                            //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                            let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 24, log_message: 'stb_reset', create_dt: update_time, regdate: update_time });
                            newGlogs.save(function (error, data) {
                                if (error) {
                                    console.error(error.message);
                                }
                            });
                            //TODO: 보낸 것에 대한 리턴 처리구현 + 몽고 캐시 삭제
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    control_device_info(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        //conn.release();
                        json.sch_name ? sch_name = json.sch_name : sch_name = '';
                        json.tp_name ? tp_name = json.tp_name : tp_name = '';
                        json.stb_version ? stb_version = json.stb_version : stb_version = '';
                        json.stb_ip ? stb_ip = json.stb_ip : stb_ip = '';
                        if (result[0].cnt > 0) {
                            conn.query("update `stb` set network_status=?,tv_status=?, mac_address=?, hdd_total=?, hdd_used=?, sch_name=?, tp_name=?, app_version=?, ip_address=?, info_update_time=? where serial_number=?", ['Y',json.value.tv_status, json.value.mac_addr, json.value.hdd_total, json.value.hdd_used, json.value.sch_name, json.value.tp_name, json.value.stb_version, json.value.stb_ip, update_time, json.value.stb_sn])
                                .then(rows => {
                                    //conn.release();
                                    
                                    let send_data = {
                                        stb_sn: result[0].serial_number
                                    };
                                    
                                    client.publish('/control/device_info/result/' + result[0].serial_number, JSON.stringify(send_data), mqtt_option);
                                    //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                                    let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: 29, log_message: 'control_device_info', create_dt: update_time, regdate: update_time });
                                    newGlogs.save(function (error, data) {
                                        if (error) {
                                            console.log(error);
                                        }
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                            //conn.release();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    control_rrd(json) {
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
                            let value = json.value;
                            let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
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

                                    send_data = {
                                        stb_sn: result[0].stb_sn
                                    };
                                    client.publish('/statistics/contents/result/' + result[0].stb_sn, JSON.stringify(send_data), mqtt_option);
                                    //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                                    let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: json.stb_sn, log_no: 30, log_message: 'control_rrd', create_dt: update_time, regdate:update_time });
                                    newGlogs.save(function (error, data) {
                                        if (error) {
                                            console.log(error);
                                        } else {

                                        }
                                    });
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

                                send_data = {
                                    stb_sn: result[0].stb_sn
                                };
                                client.publish('/statistics/contents/result/' + result[0].stb_sn, JSON.stringify(send_data), mqtt_option);
                                //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                                let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: json.stb_sn, log_no: 30, log_message: 'control_rrd', create_dt: update_time, regdate:update_time });
                                newGlogs.save(function (error, data) {
                                    if (error) {
                                        console.log(error);
                                    } else {

                                    }
                                });
                            }
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

    log_status(json) {
        let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
        let send_data;
        getConnectionDummy()
            .then(conn => {
                conn.query("SELECT count(*) as cnt, name, serial_number,vip_status FROM `stb` where serial_number=?", [json.stb_sn])
                    .then(result => {
                        if (result[0].cnt > 0) {
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
                                stb_sn: result[0].serial_number,
                                message : log_message
                            };
                            client.publish('/statistics/contents/result/' +  result[0].serial_number, JSON.stringify(send_data), mqtt_option);
                            //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                            let newGlogs = new Glogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: log_no, log_message: log_message, create_dt: update_time, regdate: update_time });
                            newGlogs.save(function (error, data) {
                                if (error) {
                                    console.error(error.message);
                                }
                            });

                            //TODO:SMS송출
                            if(result[0].vip_status == "Y") {
                                //TODO:단말에 추가로 해당 발생된 시간이 나와야함
                                let newvipGlogs = new vipGlogs({ process_status: 'N', stb_id: result[0].name, stb_sn: result[0].serial_number, log_no: log_no, log_message: log_message, create_dt: update_time, regdate: update_time });
                                newvipGlogs.save(function (error, data) {
                                    if (error) {
                                        console.error(error.message);
                                    }
                                });
                            }
                        }
                        //conn.release();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    },

}
function unserialize (data) {
    var utf8Overhead = function (str) {
        var s = str.length
        for (var i = str.length - 1; i >= 0; i--) {
            var code = str.charCodeAt(i)
            if (code > 0x7f && code <= 0x7ff) {
            s++
            } else if (code > 0x7ff && code <= 0xffff) {
            s += 2
            }
            // trail surrogate
            if (code >= 0xDC00 && code <= 0xDFFF) {
            i--
            }
        }
        return s - 1
    }
    var readUntil = function (data, offset, stopchr) {
        var i = 2
        var buf = []
        var chr = data.slice(offset, offset + 1)

        while (chr !== stopchr) {
            if ((i + offset) > data.length) {
            throw Error('Invalid')
            }
            buf.push(chr)
            chr = data.slice(offset + (i - 1), offset + i)
            i += 1
        }
        return [buf.length, buf.join('')]
    }
    var readChrs = function (data, offset, length) {
        var i, chr, buf

        buf = []
        for (i = 0; i < length; i++) {
            chr = data.slice(offset + (i - 1), offset + i)
            buf.push(chr)
            length -= utf8Overhead(chr)
        }
        return [buf.length, buf.join('')]
    }
    function _unserialize (data, offset) {
        var dtype
        var dataoffset
        var keyandchrs
        var keys
        var contig
        var length
        var array
        var obj
        var readdata
        var readData
        var ccount
        var stringlength
        var i
        var key
        var kprops
        var kchrs
        var vprops
        var vchrs
        var value
        var chrs = 0
        var typeconvert = function (x) {
            return x
        }

        if (!offset) {
            offset = 0
        }
        dtype = (data.slice(offset, offset + 1))
        dataoffset = offset + 2

        switch (dtype) {
            case 'i':
                typeconvert = function (x) {
                    return parseInt(x, 10)
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
            break
            case 'b':
                typeconvert = function (x) {
                    const value = parseInt(x, 10)

                    switch (value) {
                    case 0:
                        return false
                    case 1:
                        return true
                    default:
                        throw SyntaxError('Invalid boolean value')
                    }
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
            break
            case 'd':
                typeconvert = function (x) {
                    return parseFloat(x)
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
            break
            case 'n':
                readdata = null
            break
            case 's':
                ccount = readUntil(data, dataoffset, ':')
                chrs = ccount[0]
                stringlength = ccount[1]
                dataoffset += chrs + 2

                readData = readChrs(data, dataoffset + 1, parseInt(stringlength, 10))
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 2
                if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
                    throw SyntaxError('String length mismatch')
                }
            break
            case 'a':
                readdata = {}

                keyandchrs = readUntil(data, dataoffset, ':')
                chrs = keyandchrs[0]
                keys = keyandchrs[1]
                dataoffset += chrs + 2

                length = parseInt(keys, 10)
                contig = true

                for (i = 0; i < length; i++) {
                    kprops = _unserialize(data, dataoffset)
                    kchrs = kprops[1]
                    key = kprops[2]
                    dataoffset += kchrs

                    vprops = _unserialize(data, dataoffset)
                    vchrs = vprops[1]
                    value = vprops[2]
                    dataoffset += vchrs

                    if (key !== i) {
                    contig = false
                    }

                    readdata[key] = value
                }

                if (contig) {
                    array = new Array(length)
                    for (i = 0; i < length; i++) {
                    array[i] = readdata[i]
                    }
                    readdata = array
                }

                dataoffset += 1
            break
            case 'O': {
                // O:<class name length>:"class name":<prop count>:{<props and values>}
                // O:8:"stdClass":2:{s:3:"foo";s:3:"bar";s:3:"bar";s:3:"baz";}
                readData = readUntil(data, dataoffset, ':') // read class name length
                dataoffset += readData[0] + 1
                readData = readUntil(data, dataoffset, ':')

                if (readData[1] !== '"stdClass"') {
                    throw Error('Unsupported object type: ' + readData[1])
                }

                dataoffset += readData[0] + 1 // skip ":"
                readData = readUntil(data, dataoffset, ':')
                keys = parseInt(readData[1], 10)

                dataoffset += readData[0] + 2 // skip ":{"
                obj = {}

                for (i = 0; i < keys; i++) {
                    readData = _unserialize(data, dataoffset)
                    key = readData[2]
                    dataoffset += readData[1]

                    readData = _unserialize(data, dataoffset)
                    dataoffset += readData[1]
                    obj[key] = readData[2]
                }

                dataoffset += 1 // skip "}"
                readdata = obj
                break
            }
            default:
            throw SyntaxError('Unknown / Unhandled data type(s): ' + dtype)
        }
        return [dtype, dataoffset - offset, typeconvert(readdata)]
    }

    try {
        if (typeof data !== 'string') {
            return false
        }
        return _unserialize(data, 0)[2]
    } catch (err) {
        console.error(err)
        return false
    }
}
