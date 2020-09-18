const moment = require('moment');
const client = require('./mqtt_load');
const fn = require('./mqtt_function.js');
var ip = require('ip');
let server_ip
client.on('connect', function(test) {
    console.log('MQTT connected.');
    server_ip = ip.address()
    client.subscribe([
        '/login/+',
        '/logout/+',
        '/disconnect/result/+',
        '/download/+',
        '/access/request/+',
        '/access/realtime/+',
        '/access/addpeople/+',
        '/control/log/result/+',
        '/control/capture/start/result/+',
        '/control/capture/upload/+',
        '/control/capture/end/result/+',
        '/control/sdcard/delete/result/+',
        '/control/sdcard/part/delete/result/+',
        '/control/reboot/result/+',
        '/control/get_device_file_list/result/+',
        '/control/reset/result/+',
        '/control/device_info/+',
        '/control/temperature/result/+',
        '/control/rrd/+',
        '/log/status/+',
        '/control/capture/start/devices',
        '/control/capture/end/devices',
        '/control/log/devices',
        '/control/sdcard/delete/devices',
        '/control/sdcard/part/delete/devices',
        '/control/reboot/devices',
        '/control/get_device_file_list/devices',
        '/control/reset/devices',
        '/control/temperature/devices'
    ], (error, result) => {
        if (error) {
            console.log('MQTT subscribe error.');
        } else {
            console.log('MQTT subscribed.');
        }
    });
});

setInterval(function() { //10분마다 on / off 를 확인한다.    
    fn.chk_status();
}, 10 * 60 * 1000);

client.on('message', async function(topic, message) {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' ' + topic);
    try {
        let context = message.toString();
        let json = JSON.parse(context);
        
        if (topic === '/control/capture/start/devices') {
            if (json.stb_sn[0] != undefined) {
                fn.capture_start(json);
            }
        }

        if (topic === '/control/capture/end/devices') {
            if (json.stb_sn[0] != undefined) {
                fn.capture_end(json);
            }
        }

        if (topic === '/control/log/devices') {
            if (json.stb_sn[0] != undefined) {
                fn.log(json);
            }
        }

        if (topic === '/control/sdcard/delete/devices') {
            if (json.stb_sn[0] != undefined) {
                fn.sdcard_delete(json);
            }
        }

        if (topic === '/control/sdcard/part/delete/devices') {
            if (json.stb_sn[0] != undefined) {
                fn.sdcard_part_delete(json);
            }
        }

        if (topic === '/control/reboot/devices') {
            if (json.stb_sn[0] != undefined) {
                fn.reboot(json);
            }
        }

        if (topic === '/control/get_device_file_list/devices') {
            if (json.stb_sn[0] != undefined) {
                fn.get_device_file_list(json);
            }
        }

        if (topic === '/control/reset/devices') {
            if (json.stb_sn[0] != undefined) {
                fn.reset(json);
            }
        }

        if (topic === '/control/temperature/devices') {
            if (json.stb_sn[0] != undefined) {
                fn.temperature(json);
            }
        }

        // if (topic === '/control/capture/start/devices') {
        //     if (json.stb_sn[0] != undefined) {
        //         fn.login(json);
        //     }
        // }
        
        /* 로그인 > 로그인 시도 */
        if (topic === "/login/" + json.stb_sn) {
            if (json.stb_sn != undefined) {
                fn.login(json);
            }
        }

        /* 서버 접속 종료 > 로그아웃 */
        if (topic === "/logout/" + json.stb_sn) {
            if (json.stb_sn != undefined) {
                fn.logout(json);
            }
        }

        /* 서버 접속 종료 > 서버 접속 종료 (서버가 끊긴경우 ) */
        if (topic === "/disconnect/result/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.disconnect_result(json);
            }
        }

        /* 컨텐츠 > 다운로드 진행율 */
        if (topic === "/download/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.download(json);
            }
        }

        /* 출입통제 > 서버에서 가진 데이터 요청*/
        if (topic === "/access/request/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.access_request(json);
            }
        }

        /* 출입통제 > 서버에서 가진 데이터 요청*/
        if (topic === "/access/request/result/result/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.access_request_result_result(json);
            }
        }

        /* 출입통제 > 단말 실시간 데이터*/
        if (topic === "/access/realtime/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.access_realtime(json,server_ip);
            }
        }

        /* 출입통제 > 단말 데이터 등록*/
        if (topic === "/access/addpeople/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.access_addpeople(json,server_ip);
            }
        }

        /* 제어 > 단말기 로그 요청 */
        if (topic === "/control/log/result/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_log_result(json);
            }
        }
        
        /* 제어 > 화면 캡쳐 시작 */
        if (topic === "/control/capture/start/result/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_capture_start_result(json);
            }
        }

        /* 제어 > 화면 캡쳐 업로드 */
        if (topic === "/control/capture/upload/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_capture_upload(json,server_ip);
            }
        }

        /* 제어 > 화면 캡쳐 종료 */
        if (topic === "/control/capture/end/result/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_capture_end_result(json);
            }
        }

        /* 제어 > sdcard 삭제 */
        if (topic === "/control/sdcard/delete/result/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_sdcard_delete_result(json);
            }
        }
                
        /* 제어 > sdcard 사용하지 않는 파일삭제 */
        if (topic === "/control/sdcard/part/delete/result/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_sdcard_part_delete_result(json);
            }
        }

        /* 제어 > 재부팅 */
        if (topic === "/control/reboot/result/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_reboot_result(json);
            }
        }

        /* 제어 > 디바이스 컨텐츠리스트 요청 */
        if (topic === "/control/get_device_file_list/result/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_get_device_file_list_result(json);
            }
        }

        /* 제어 > 시스템 초기화 */
        if (topic === "/control/reset/result/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_reset_result(json);
            }
        }

        /* 제어 > 온도 설정 */
        if (topic === "/control/temperature/result/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_temperature_result(json);
            }
        }
        
        /* 통계 > 디바이스 정보 */
        if (topic === "/control/device_info/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_device_info(json);
            }
        }
        
        /* 통계 > RRD 정보 */
        if (topic === "/control/rrd/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.control_rrd(json);
            }
        }
        
        /* 통계 > 각종 로그 */
        if (topic === "/log/status/" + json.stb_sn) { 
            if (json.stb_sn != undefined) {
                fn.log_status(json);
            }
        }
        
        
    } catch (error) {
        console.log(error);
    }
});
