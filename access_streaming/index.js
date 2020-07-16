var ffmpeg = require('fluent-ffmpeg')
var express = require('express')
var mkdirp = require('mkdirp');
var cors = require('cors');
var fs = require('fs');
var moment = require('moment');
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 
var app = express();

const logger = require('morgan')

function video_timeout (req, res, next) {
    if(req.url.split('/').length === 4){
        let fileData = req.url.split('/')[3].split('.')
        if(fileData[1] === 'm3u8') {
            var index = stream_list.findIndex(i => i.id == fileData[0]); 
            stream_list[index]._clearTimeout();
            stream_list[index]._setTimeout();
        }
    }
    next()
  }

app.use(video_timeout)
app.use(express.json())
app.use(cors())
app.use('/stream',express.static('./videos'));

let stream_list = [];
let pre_id = '';

app.get('/list', (req, res) => {
    res.send(stream_list);
})

app.post('/start', async function(req, res) {
    let id = Math.random().toString(36).substr(2,11)
    mkdirp('./videos/'+id);
    let temp = new ffmpeg(req.body.uri).addOptions([
        '-fflags nobuffer',
        '-c:v copy',
        '-c:a copy',
        '-bufsize 1835k',
        '-pix_fmt yuv420p',
        '-flags low_delay',
        '-flags',
        '-global_header',
        '-hls_time 3',
        '-hls_list_size 6',
        '-hls_wrap 10',
        '-start_number 1'
    ]).withVideoBitrate('650k', true)
    .on('start', function(commandLine) {
        console.log('Spawned FFmpeg with command: ' + commandLine);
    })
    .on('codecData', function(data) {
        let object = {
            id : id,
            url : '/stream/'+id+".m3u8",
            stream : temp,
            timer : null,
            _setTimeout:function(){
                let _this = this;
                _this.timer = setTimeout(async function() {
                    var path = './videos/'+_this.id
                    var index = stream_list.findIndex(i => i.id == _this.id); 
                    await stream_list[index]['stream'].kill('SIGTERM')
                    await stream_list.splice(index,1);
                    deleteFolderRecursive(path)
                }, 20000);
            },
            _clearTimeout: function(){
                let _this = this;
                clearTimeout(_this.timer);
            }
        }
        object._setTimeout()
        stream_list.push(object);
        res.send({ id : id,url : '/strea/'+id+".m3u8",});
    }).on('error', function(err) {
        deleteFolderRecursive('./videos/'+id)
        console.log(moment().format('YYYY-MM-DD HH:mm:ss')+' Cannot process video: ' + err.message);
    }).saveToFile('./videos/'+id+'/'+id+'.m3u8');
})

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
};

app.post('/stop', async function(req, res) {
    if(req.body.id && pre_id !== req.body.id){
        pre_id = req.body.id;//2번 실행 방지
        var path = './videos/'+req.body.id
        var index = stream_list.findIndex(i => i.id == req.body.id);
        await stream_list[index]['stream'].kill('SIGTERM')
        await stream_list[index]._clearTimeout();
        stream_list.splice(index,1);
        deleteFolderRecursive(path)
        res.send({});
    } else {
        res.send({error:"id is undefined"});
    }
})

app.listen(4000)