const fs = require("fs");
const path = require("path");
const site_info_json = fs.readFileSync(path.join(__dirname, "cloud40.json"));
const site = JSON.parse(site_info_json);
const moment = require('moment');
const request = require('request');
const archiver = require('archiver');
const CronJob = require('cron').CronJob;
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    timeout: 60 * 60 * 1000,
    host: site.maria_host,
    port: site.maria_port,
    user: site.maria_user,
    password: site.maria_passwd,
    database: site.maria_database,
    collation: 'utf8_general_ci',
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
    pipelining: false
});

const getConnectionDummy = () => {
    return new Promise(resolve => {
        resolve(pool);
    })
};

const sleep = (ms = 1000) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

getConnectionDummy()
    .then(conn => {
        //console.log("connected ! connection info is " + conn.info.threadId);
        //conn.release(); //release to pool
    })
    .catch(err => {
        //console.log("not connected due to error: " + err);
    });

/* AP1 서버에서 돌고 있다면 AP2에서는 돌리지 않는다. 30초마다 체크. */
//TODO: 도커스웜어떻게될지모르니 나중에 처리
/*
const http = require("http");
const os = require("os");

http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Running");
    res.end();
}).listen(19098);

let canRunning = true;

const checkServerRuning = () => {
    request('http://' + site.first_server_ip + ':19098', (error, response, body) => {
        if (error) {
            canRunning = true;
        }else {
            if (body == "Running") {
                console.log("AP1 Server was running so stop interval.");
                canRunning = false;
            }else {
                console.log(body);
                canRunning = true;
            }
        }
    });
};

if (!os.hostname().includes("01")) {
    canRunning = false;
    setInterval(checkServerRuning, 30 * 1000);
    checkServerRuning();
}
*/

const mongoose = require('mongoose');
const mongodb = mongoose.connection;
mongodb.on('error', console.error);
mongodb.once('open', function() {
    console.log('mongodb open');
});
/*
mongoose.connect('mongodb://' + site.mongodb_user + ':' + site.mongodb_passwd + '@' + site.mongodb_host + ':27017/' + site.mongodb_database + '?poolSize=400', { useUnifiedTopology: true, useNewUrlParser: true }, function() {
    console.log('mongoose open');
});
*/
mongoose.connect('mongodb://' + site.mongodb_host + ':27017/' + site.mongodb_database + '?poolSize=400', { useUnifiedTopology: true, useNewUrlParser: true }, function() {
    console.log('mongoose open');
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

const serverglogs = mongoose.Schema({
    process_status: 'string',
    log_no: 'number',
    log_message: 'string',
    create_dt: 'string',
    regdate: 'string'
});
const serverGlogs = mongoose.model('g_serverlogs', serverglogs);

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

const onoffglogs = mongoose.Schema({
    process_status: 'string',
    on_count: 'number',
    off_count: 'number',
    all_count: 'number',
    create_dt: 'string',
    regdate: 'string'
});
const onoffGlogs = mongoose.model('g_onofflogs', onoffglogs);

// 디바이스 연결 상태 체크 (emqx api 사용)
setInterval(function() {
    //if (!canRunning) return;

    //console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + " Check mqtt_network_status...");
    request(site.base_local_url + '/api/v1/stb/mqtt_network_status', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }
    });
}, 60 * 1000);

// 라이브 소켓 오류
setInterval(function() {
    //if (!canRunning) return;
    let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
    request(site.base_local_url + '/api/thirdparty/streaming/thirdparty_ping_check', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }else{
            if(body == "fail"){
                let newserverGlogs = new serverGlogs({ process_status: 'N', log_no: 1, log_message: 'Live Server Error', create_dt: update_time, regdate: update_time });
                newserverGlogs.save(function (error, data) {
                    if (error) {
                        console.error(error.message);
                    }
                });
            }
        }
    });
}, 60 * 1000);

// NTP Server 오류
setInterval(function() {
    //if (!canRunning) return;
    let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
    request(site.base_local_url + '/api/thirdparty/streaming/ntp_ping_check', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }else{
            let json = JSON.parse(body);
            for(let i=0; i < json.length; i++){
                let ntp_data = json[i];
                if(ntp_data.result === 'fail'){
                    if(ntp_data.address === site.ntp_server1){
                        let newserverGlogs = new serverGlogs({ process_status: 'N', log_no: 2, log_message: 'NTP Server Error('+ntp_data.address+')', create_dt: update_time, regdate: update_time });
                        newserverGlogs.save(function (error, data) {
                            if (error) {
                                console.error(error.message);
                            }
                        });
                    }else if(ntp_data.address === site.ntp_server2){
                        let newserverGlogs = new serverGlogs({ process_status: 'N', log_no: 3, log_message: 'NTP Server Error('+ntp_data.address+')', create_dt: update_time, regdate: update_time });
                        newserverGlogs.save(function (error, data) {
                            if (error) {
                                console.error(error.message);
                            }
                        });
                    }else if(ntp_data.address === site.ntp_server3){
                        let newserverGlogs = new serverGlogs({ process_status: 'N', log_no: 4, log_message: 'NTP Server Error('+ntp_data.address+')', create_dt: update_time, regdate: update_time });
                        newserverGlogs.save(function (error, data) {
                            if (error) {
                                console.error(error.message);
                            }
                        });
                    }
                }
            }
        }
    });
}, 60 * 1000);

// 디바이스 컨텐츠리스트 체크 (전체)
setInterval(function() {
    //if (!canRunning) return;

    //console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + " Check mqtt_network_status...");
    request(site.base_local_url + '/api/v1/stb/mqtt_allstb_contents_list', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }
    });
}, 60 * 10 * 1000);

// 1분 기준 전체 단말 수, 켜져 있는 단말 수 
setInterval(function() {
    getConnectionDummy()
        .then(conn => {
            conn.query("select * from `stb`")
                .then(result => {
                    let on_count = 0;
                    let off_count = 0;
                    let all_count = 0;
                    let update_time = moment().format('YYYY-MM-DD HH:mm:ss');
                    for (let i = 0; i < result.length; i++) {
                        let value = result[i];
                        if(value.network_status == "Y"){
                            on_count++;
                            all_count++;
                        }else{
                            off_count++;
                            all_count++;
                        }
                    }
                    
                    let newonoffGlogs = new onoffGlogs({ process_status: 'N', on_count: on_count, off_count: off_count, all_count: all_count, create_dt: update_time, regdate: update_time });
                    newonoffGlogs.save(function (error, data) {
                        if (error) {
                            console.error(error.message);
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
}, 60 * 1000);



// 통계 연산작업 (g_monitor_contents) -> 일, 주, 월별로 변경 
new CronJob('00 00 01 * * *', function() {
    //if (!canRunning) return;

    //console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + " Progress auto_statistics cronjob...");
    request(site.base_local_url + '/api/v1/statistics/content_logs/auto_statistics', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }
    });
}, null, true, 'Asia/Seoul');

// 통계 연산작업 (g_logs) -> 일, 주, 월별로 변경 
new CronJob('00 00 01 * * *', function() {
    //if (!canRunning) return;

    //console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + " Progress auto_statistics cronjob...");
    request(site.base_local_url + '/api/v1/statistics/stb_logs/auto_stb_logs_statistics', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }
    });
}, null, true, 'Asia/Seoul');

// 통계 연산작업 (g_viplogs) -> 일, 주, 월별로 변경 
new CronJob('00 00 01 * * *', function() {
    //if (!canRunning) return;
    
    //console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + " Progress auto_statistics cronjob...");
    request(site.base_local_url + '/api/v1/statistics/vip_stb_logs/auto_vip_stb_logs_statistics', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }
    });
}, null, true, 'Asia/Seoul');

// 통계 연산작업 (g_onofflogs) -> 일, 주, 월별로 변경 
new CronJob('00 00 01 * * *', function() {
    //if (!canRunning) return;
    
    //console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + " Progress auto_statistics cronjob...");
    request(site.base_local_url + '/api/v1/statistics/on_off_stb_logs/auto_on_off_stb_logs_statistics', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }
    });
}, null, true, 'Asia/Seoul');

//TODO: 일단통계연산은 한번에 돌려보고 가짜데이터 쌓아놓고 테스트해볼것
// 통계 연산작업 (g_serverlogs) -> 일, 주, 월별로 변경 
new CronJob('00 00 01 * * *', function() {
    //if (!canRunning) return;

    //console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + " Progress auto_statistics cronjob...");
    request(site.base_local_url + '/api/v1/statistics/thirdparty_error_logs/auto_server_statistics', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }
    });
}, null, true, 'Asia/Seoul');

// 매일 새벽 4시에 실행한다.
new CronJob('00 00 04 * * *', function() { //매일 체크 해서 삭제한다.
    //if (!canRunning) return;
    
    let glogs_check_time = moment().subtract(10, 'days').format('YYYY-MM-DD HH:mm:ss');
    Glogs.deleteMany({ regdate: { $lte: glogs_check_time } }, function(error, data) {
        if (error) {
            console.error(error.message);
        }
    });
    let gmonitorcontents_check_time = Math.round(new Date(moment().subtract(10,'days').format('YYYY-MM-DD')).getTime()/1000);
    Gcontents.deleteMany({ regdate: { $lte: gmonitorcontents_check_time } }, function(error, data){
        if (error) {
            console.error(error.message);
        }
    });
    let gserverlogs_check_time = moment().subtract(10, 'days').format('YYYY-MM-DD HH:mm:ss');
    serverGlogs.deleteMany({ regdate: { $lte: gserverlogs_check_time } }, function(error, data) {
        if (error) {
            console.error(error.message);
        }
    });
    let gviplogs_check_time = moment().subtract(10, 'days').format('YYYY-MM-DD HH:mm:ss');
    vipGlogs.deleteMany({ regdate: { $lte: gviplogs_check_time } }, function(error, data) {
        if (error) {
            console.error(error.message);
        }
    });
    
    let gonofflogs_check_time = moment().subtract(10, 'days').format('YYYY-MM-DD HH:mm:ss');
    onoffGlogs.deleteMany({ regdate: { $lte: gonofflogs_check_time } }, function(error, data) {
        if (error) {
            console.error(error.message);
        }
    });

    let delete_day = moment().subtract(2, 'days').format('YYYYMMDD');
    let delete_day_unixtime = Math.round(new Date(moment().subtract(2,'days').format('YYYY-MM-DD')).getTime()/1000);

    let path = site.base_server_document + "uploads/monitor";
    fs.readdir( path , function(error, filelist){
        filelist.forEach(element => {                
            if(moment(element, "YYYYMMDD").valueOf() < moment(delete_day, "YYYYMMDD").valueOf()){
                deleteDirectory(path+"/"+element);
            }
        });    
    });
    getConnectionDummy()
        .then(conn => {
            conn.query("DELETE FROM `stb_monitor_screen` where update_time < ?", [delete_day_unixtime])
                .then(result => {
                    conn.query("DELETE FROM `stb_monitor_last_screen` where update_time < ?", [delete_day_unixtime])
                        .then(rows => {
                            
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
}, null, true, 'Asia/Seoul');

// 디스트리뷰트 예약 내용 체크 (매분 1초에 체크한다)
new CronJob('01 * * * * *', function() {
    //if (!canRunning) return;

    request(site.base_local_url + '/api/v1/distributor/check_reservated_distribute', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }
    });
}, null, true, 'Asia/Seoul');

// 배포 오류 및 재시도 확인한다. (30초마다 체크한다)
new CronJob('0/30 * * * * *', function() {
    //if (!canRunning) return;

    request(site.base_local_url + '/api/v1/distributor/check_distribute_error', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }
    });
}, null, true, 'Asia/Seoul');

// 긴급 배포 오류 및 재시도 확인한다. (10초마다 체크한다)
new CronJob('0/10 * * * * *', function() {
    //if (!canRunning) return;

    request(site.base_local_url + '/api/v1/distributor/check_emergency_distribute_error', function(error, response, body) {
        if (error) {
            console.error(error.message);
        }
    });
}, null, true, 'Asia/Seoul');


function deleteFile(dir, file) {
    return new Promise(function (resolve, reject) {
        var filePath = path.join(dir, file);
        fs.lstat(filePath, function (err, stats) {
            if (err) {
                return reject(err);
            }
            if (stats.isDirectory()) {
                resolve(deleteDirectory(filePath));
            } else {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    });
};

function deleteDirectory(dir) {
    return new Promise(function (resolve, reject) {
        fs.access(dir, function (err) {
            if (err) {
                return reject(err);
            }
            fs.readdir(dir, function (err, files) {
                if (err) {
                    return reject(err);
                }
                Promise.all(files.map(function (file) {
                    return deleteFile(dir, file);
                })).then(function () {
                    fs.rmdir(dir, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                }).catch(reject);
            });
        });
    });
};
