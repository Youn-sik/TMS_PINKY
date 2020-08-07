<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-expansion-panels
        v-model="panel"
        multiple
      >
        <v-expansion-panel>
          <v-expansion-panel-header>스트리밍</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-col class="d-flex">
              <video id="my_video_1" class="video-js vjs-theme-city" vjs-big-play-centered controls preload="auto" style="width:100%; height:700px">
                <source src="http://172.16.135.89:4000/stream/test/playlist.m3u8" type="application/x-mpegURL"/>
              </video>
            </v-col>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <v-col cols="11">
      <v-card
        outlined
        elevation="1"
        align="center"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="mb-4">총합</div>
            <v-list-item-title class="headline mb-1">{{api_v3_device_camera.length}}</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">온라인</div>
            <v-list-item-title class="headline mb-1">{{online}}</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">오프라인</div>
            <v-list-item-title class="headline mb-1">{{offline}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="11" class="d-flex">
      <v-card width="100%">
        <v-card-title>
          단말 목록
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            clearable
            hide-details
            label="검색"
          ></v-text-field>
          <div>
            <v-btn class="ml-2 mr-2 mt-4" color="error" v-if="deviceSelected[0]" @click="delDevice"><v-icon dark left>delete_forever</v-icon>삭제</v-btn>
            <v-btn color="error" class="ml-2 mr-2 mt-4" v-else disabled><v-icon dark left>delete_forever</v-icon>삭제</v-btn>
            <v-dialog v-model="batchSettingModal" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn class="mr-2 mt-4" color="primary" v-if="deviceSelected[0]" dark v-on="on"><v-icon dark left>settings</v-icon>업데이트</v-btn>
                <v-btn color="error" class="mt-4 mr-2" v-else disabled><v-icon dark left>settings</v-icon>업데이트</v-btn>
              </template>
              <v-card v-if="deviceSelected[0]"> 
                <v-card-title>
                  <span class="headline">단말기 업데이트</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-autocomplete
                              :items="gatewayList"
                              label="*게이트 웨이"
                              v-model="gateway"
                              item-text="name"
                              :return-object="true"
                              :placeholder="deviceSelected[0].gateway_obid.name"
                            ></v-autocomplete>
                            <v-text-field label="*단말기 이름" v-model="deviceName" :placeholder="deviceSelected[0].name" required></v-text-field>
                            <v-text-field label="*단말기 위치" v-model="deviceLocation" :placeholder="deviceSelected[0].location" required></v-text-field>
                            <v-text-field label="*시리얼넘버" v-model="serial_number" :placeholder="deviceSelected[0].serial_number" required></v-text-field>
                            <v-text-field label="*비고" v-model="description" :placeholder="deviceSelected[0].description" required></v-text-field>
                            <v-autocomplete
                              :items="['RTSP', 'ONVIF','GB28181']"
                              label="*프로토콜"
                              :placeholder="['RTSP', 'ONVIF','GB28181'][deviceSelected[0].protocol-1]"
                              v-model="protocol"
                            ></v-autocomplete>
                            <v-text-field label="*URL" v-model="url" :placeholder="deviceSelected[0].url" required></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                      <small>*표시는 필수 항목 입니다</small>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="cancelUpdateModal">취소</v-btn>
                  <v-btn color="blue darken-1" text @click="updateDevice">저장</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="controlModal"
              max-width="50%"
            >
              <template v-slot:activator="{ on }">
                <v-btn class="mr-2 mt-4" color="primary" v-on="on"><v-icon dark left>delete_forever</v-icon>제어</v-btn>
                <!-- <v-btn class="mr-2 mt-4" v-else disabled><v-icon dark left>delete_forever</v-icon>제어</v-btn> -->
              </template>
              <v-card>
                <v-card-text>
                  <v-row justify="center">
                    <v-card flat width="49%">
                      <v-card-title>단말 목록</v-card-title>
                      <v-treeview
                      :items="api_v3_device_camera"
                      item-key="_id"
                      :active.sync="active"
                      activatable
                      :return-object="true"
                    >
                      <template v-slot:prepend="{}">
                        <v-icon
                          v-text="`dns`"
                        ></v-icon>
                      </template>
                    </v-treeview>
                    </v-card>
                    <v-divider  vertical></v-divider>
                    <v-card flat width="50%" style="text-align: center">
                      <v-card-title style="margin-left:10px">제어</v-card-title>
                      <v-btn color="primary" class="mb-3" @click="controlDeviceLog">단말기 로그 요청</v-btn><br/>
                      <v-spacer></v-spacer>
                      <v-row justify="center">
                        <v-col cols="6">
                          <v-menu
                            ref="menu"
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="time"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="time"
                                label="캡쳐 시간 설정"
                                prepend-icon="access_time"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-if="menu2"
                              v-model="time"
                              full-width
                              use-seconds
                              max="00:59:59"
                              format="24hr"
                              @click:second="$refs.menu.save(time)"
                            ></v-time-picker>
                          </v-menu>
                          <v-select
                            :items="['1920*1080','1280*720','640*480','320*240']"
                            v-model="display"
                            prepend-icon="tv"
                            label="캡쳐 해상도 설정"
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-btn color="primary" class="mb-3" @click="controlCaptureStart">캡쳐 시작</v-btn><br/>
                      <v-btn color="primary" class="mb-3" @click="controlCaptureEnd">캡쳐 종료</v-btn><br/>
                      <v-btn color="primary" class="mb-3" @click="controlSDcardDel">sd카드 삭제</v-btn><br/>
                      <v-btn color="primary" class="mb-3" @click="controlSDcardPartDel">sd카드 미사용 파일 삭제</v-btn><br/>
                      <v-btn color="primary" class="mb-3" @click="controlDeviceReboot">재부팅</v-btn><br/>
                      <v-btn color="primary" class="mb-3" @click="controlContentsReq">단말 컨텐츠 목록 요청</v-btn><br/>
                      <v-btn color="primary" class="mb-3" @click="controlDeviceReset">시스템 초기화</v-btn><br/>
                    </v-card>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="controlModal = false">닫기</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog> 
            <v-dialog v-model="addUserModal" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn class="mt-4" color="primary" dark v-on="on"><v-icon dark left>mdi-plus</v-icon>추가</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">단말기 추가</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-radio-group v-model="deviceRadio" row>
                          <v-radio
                            label='게이트 웨이'
                            value='gateway'
                          ></v-radio>
                          <v-radio
                            label='단말기'
                            value='device'
                          ></v-radio>
                        </v-radio-group>
                        <template v-if="deviceRadio === 'gateway'">
                          <v-text-field label="*게이트웨이 이름" v-model="deviceName" required></v-text-field>
                          <v-text-field label="*게이트웨이 위치" v-model="deviceLocation" required></v-text-field>
                          <v-text-field label="*게이트웨이 IP" v-model="deviceIP" required></v-text-field>
                          <v-text-field label="*포트 번호" v-model="port" required></v-text-field>
                        </template>
                        <template v-if="deviceRadio === 'device'">
                          <v-autocomplete
                            :items="gatewayList"
                            label="*게이트 웨이"
                            v-model="gateway"
                            item-text="name"
                            :return-object="true"
                          ></v-autocomplete>
                          <v-text-field label="*단말기 이름" v-model="deviceName" required></v-text-field>
                          <v-text-field label="*단말기 위치" v-model="deviceLocation" required></v-text-field>
                          <v-text-field label="*시리얼넘버" v-model="serial_number" required></v-text-field>
                          <v-text-field label="*비고" v-model="description" required></v-text-field>
                          <v-autocomplete
                            :items="['RTSP', 'ONVIF','GB28181']"
                            label="*프로토콜"
                            v-model="protocol"
                          ></v-autocomplete>
                          <v-text-field label="*URL" v-model="url" required></v-text-field>
                        </template>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*표시는 필수 항목 입니다</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="cancelDeviceModal">취소</v-btn>
                  <v-btn color="blue darken-1" text @click="addDevice">저장</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-card-title>
        <v-data-table
          :headers="headers"
          v-model="deviceSelected"
          :single-select="true"
          :items-per-page="itemsPerPage"
          :page.sync="page"
          @page-count="pageCount = $event"
          hide-default-footer
          :single-expand='true'
          show-select
          :search="search"
          :items="api_v3_device_camera"
          :expanded.sync="expanded"
          item-key="_id"
          show-expand
          class="elevation-0"
        >
          <template v-slot:item.streaming="{item}">
            <v-btn @click="startStreaming(item)"  v-if="nowStreaming === item.serial_number" disabled @click:outside="endStreaming(item)" color="primary" small>스트리밍 재생</v-btn>
            <v-btn @click="startStreaming(item)"  v-else @click:outside="endStreaming(item)" color="primary" small>스트리밍 재생</v-btn>
          </template>
          <template v-slot:expanded-item="{ item }">
            <td :colspan="headers.length+1" class="deviceTab pa-0">
              <v-tabs
                v-model="tab"
                background-color="#f4f6ff"
              >
                <v-tab
                  v-for="i in tabs"
                  :key="i"
                >
                  {{i}}
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item
                  v-for="i in tabs"
                  :key="i"
                >
                  <v-card flat color="#f4f6ff">
                    <v-card-text>
                      <v-row justify="center" v-if="i === '기본 정보'">
                        <v-col cols="10">
                          <p>단말기 명 : {{item.name}}</p>
                          <p>위치 : {{item.location}}</p>
                          <p>단말기 IP : {{item.ip}}</p>
                          <p>포트 번호 : {{item.port}}</p>
                          <p>시리얼 넘버 : {{item.serial_number}}</p>
                          <p>버전 : {{item.app_version}}</p>
                          <p>프로토콜 : {{item.protocol}}</p>
                          <p>URL : {{item.url}}</p>
                          <p>생성 날짜 : {{item.create_at}}</p>
                          <p>상태 : {{item.status}}</p>
                        </v-col>
                      </v-row>
                      <v-row justify="center" v-else-if="i === '캡쳐 정보'">
                        <v-col cols="10">
                          <template v-if="item.config_data">
                            <p>캡쳐 상태 : {{item.config_data.capture_status}}</p>
                            <p>캡쳐 사이즈 : {{item.config_data.capture_size}}</p>
                            <p>캡쳐 시간 : {{item.config_data.capture_time}}</p>
                          </template>
                          <template v-else>
                            <p>캡쳐 상태 : N</p>
                          </template>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </td>
          </template>
        </v-data-table>
        <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
      </v-card>
      <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      >
        ERROR : 재생할 수 없습니다.
        <template v-slot:action="{ attrs }">
          <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>
<script>
  import videojs from 'video.js';
  import axios from 'axios';
  import mqtt from 'mqtt';
  export default {
    props:["isLogin","user_id"],
    watch: {
      active : {
        handler(val) {
          if(val.length === 0) {
            this.display = null;
            this.time = "00:00:00";
          } else if(val[0].config_data){
            if(val[0].config_data.capture_size) {
              this.display = val[0].config_data.capture_size
            } else {
              this.display = null;
            }
            
            if(val[0].config_data.capture_time) {
              this.time = "00:"+val[0].config_data.capture_time
            } else {
              this.time = "00:00:00";
            }
          } else {
            this.display = null;
            this.time = "00:00:00";
          }
        }      
      },
    },
    async mounted () {
      this.player = videojs('my_video_1',{
        userActions: {
          hotkeys: true
        },
        controlBar: {
          pictureInPictureToggle: true
        },
        liveui: true,
        autoplay:'any',
        html5: {
          hls: {
            overrideNative: true
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false,
        }
      });
      this.player.play()
      await axios.get('http://172.16.135.89:3000/camera').then(async (res) => {
        this.api_v3_device_camera = res.data;
        res.data.map((i) => {
          if(i.status === 'Y') this.online++;
          else if(i.status === 'N') this.offline++;
        })
        this.nowStreaming = this.api_v3_device_camera[0].serial_number
      })
      // axios.post('http://172.16.135.89:4000/start',{
      //   // "uri" : "rtsp://"+this.api_v3_device_camera[0].ip+":9096"
      //   "uri" : "rtsp://172.16.135.89:8554/test"
      // }).then((res) => {
      //   if(res.data.error) {
      //     this.snackbar = true;
      //   } else {
      //     this.loading = false;
      //     this.video_id = res.data.id
      //     setTimeout(() =>{
      //       this.player.src('http://172.16.135.89:4000/stream/'+this.video_id+'/'+this.video_id+'.m3u8');
      //       // this.player.currentTime(5);
      //       this.player.play();
      //       // this.player.startTracking()
      //     },4000)
      //   }
      // })
    },
    beforeDestroy () {
      if(this.video_id){
        axios.post('http://172.16.135.89:4000/stop',{
          id:this.video_id
        })
      }
      if(this.player) {
        this.player.dispose();
      }
    },
    async created () {
      this.client = mqtt.connect('ws://172.16.135.89:8083/mqtt')
      this.client.on('connect',() => {
        console.log('mqtt was connected');
        this.client.subscribe('/access/realtime/result/+')
        this.client.subscribe('/control/log/result/+')
        this.client.subscribe('/control/capture/start/result/+')
        this.client.subscribe('/control/capture/end/result+')
        this.client.subscribe('/control/sdcard/delete/result/+')
        this.client.subscribe('/control/sdcard/part/delete/result+')
        this.client.subscribe('/control/reboot/result/+')
        this.client.subscribe('/control/get_device_file_list/result/+')
        this.client.subscribe('/control/reset/result/+')
      })
      window.addEventListener('beforeunload', this.stopVideo)
      axios.get('http://172.16.135.89:3000/gateway').then((res) =>{
        this.gatewayList = res.data;
      })
    },
    data () {
      return {
        panel: [0,1],
        nowStreaming:null,
        client:null,
        access_realtime:[],
        streamingModal:false,
        api_v1_group_group:null,
        active:[],
        deviceSelected:[],
        time: "00:00:00",
        menu2: false,
        searchGroup:null,
        online:0,
        offline:0,
        itemsPerPage: 10,
        page: 1,
        loading : true,
        pageCount: 0,
        api_v3_device_camera : [],
        search: '',
        selected: [],
        video:'',
        captureTime : null,
        video_id:'',
        serial_number:null,
        deviceName: null,
        deviceLocation : null,
        snackbar : false,
        deviceIP : null,
        gatewayList : [],
        appVersion : null,
        port : null,
        account : null,
        description : null,
        streaming_device_sn:null,
        password : null,
        display : null,
        player: null,
        gateway : null,
        protocol : null,
        url : null,
        tab:null,
        switch:null,
        deviceRadio:'gateway',
        tabs: [
          "기본 정보",
          '캡쳐 정보'
        ],
        model: 1,
        expanded: [],
        singleExpand: false,
        access_headers: [
          {
            text: '',
            align: 'center',
            value: 'avatar_file_url',
            width : '10%',
            sortable: false,
          },
          { text: '온도', value: 'avatar_temperature',width : '30%' },
          { text: '생성일', value: 'access_time' },
        ],
        headers: [
          { text: '단말기 명', value: 'name' },
          { text: '버전', value: 'app_version' },
          { text: '위치', value: 'location' },
          { text: '상태', value: 'status' ,filterable: false},
          { text: '스트리밍', value: 'streaming' ,filterable: false},
          { text: '', value: 'data-table-expand',filterable: false},
        ],
        addUserModal : false,
        batchSettingModal : false,
        controlModal : false,
      }
    },
    methods: {
      stopVideo(){
        if(this.video_id) {
          axios.post('http://172.16.135.89:4000/stop',{
            id:this.video_id,
          })
        }
      },
      // endStreaming(){
      //   if(!this.loading){
      //     axios.post('http://172.16.135.89/stop',{
      //       "id":this.video_id,
      //       "alias":"test",
      //       "remove":true
      //     })
      //     videojs('my_video_1').dispose()
      //     this.video='';
      //   } else {
      //     this.snackbar=true;
      //   }
      // },
      startStreaming(item) {
        this.nowStreaming=item.serial_number;
        axios.post('http://172.16.135.89:4000/stop',{
          id:this.video_id
        })
        this.player.src('../../assets/sample.m3u8')
        this.player.play();
        axios.post('http://172.16.135.89:4000/start',{
          "uri" : "rtsp://"+item.ip+":9096/"
        }).then((res) => {
          this.video_id = res.data.id
          setTimeout(() =>{
            this.player.src('http://172.16.135.89:4000/stream/'+this.video_id+'/'+this.video_id+'.m3u8');
            this.player.play();
          },5000)
        })
        
      },
      controlDeviceLog () {
        if(this.active[0] === undefined) {
          alert('단말기를 선택해 주세요')
          return false;
        }
        this.client.publish('/control/log/'+this.active[0].serial_number,JSON.stringify({stb_sn:this.active[0].serial_number}));
        alert('제어 요청 성공')
      },
      controlCaptureStart () {
        if(this.active[0] === undefined) {
          alert('단말기를 선택해 주세요')
          return false;
        } else if (!(this.time === '00:00:00' || this.display)) {
          alert('시간,사이즈를 입력해 주세요')
          return false;
        }
        let time = this.time.substring(3);

        this.client.publish('/control/capture/start/'+this.active[0].serial_number,
        JSON.stringify({stb_sn:this.active[0].serial_number,"capture_time":time,"capture_size":this.display, "capture_status":"Y"}));
        alert('제어 요청 성공')
      },
      controlCaptureEnd () {
        if(this.active[0] === undefined) {
          alert('단말기를 선택해 주세요')
          return false;
        }
        let time = this.time.substring(3);
        this.client.publish('/control/capture/end/'+this.active[0].serial_number,
        JSON.stringify({stb_sn:this.active[0].serial_number,"stb_id":"", "capture_time":time,"capture_size":"320*240", "capture_status":"N"}));
        alert('제어 요청 성공')
      },
      controlSDcardDel () {
        if(this.active[0] === undefined) {
          alert('단말기를 선택해 주세요')
          return false;
        }
        this.client.publish('/control/sdcard/delete/'+this.active[0].serial_number,JSON.stringify({stb_sn:this.active[0].serial_number}));
        alert('제어 요청 성공')
      },
      controlSDcardPartDel () {
        if(this.active[0] === undefined) {
          alert('단말기를 선택해 주세요')
          return false;
        }
        this.client.publish('/control/sdcard/part/delete/'+this.active[0].serial_number,JSON.stringify({stb_sn:this.active[0].serial_number}));
        alert('제어 요청 성공')
      },
      controlDeviceReboot () {
        if(this.active[0] === undefined) {
          alert('단말기를 선택해 주세요')
          return false;
        }
        this.client.publish('/control/reboot/'+this.active[0].serial_number,JSON.stringify({stb_sn:this.active[0].serial_number, "message":"reboot"}));
        alert('제어 요청 성공')
      },
      controlContentsReq () {
        if(this.active[0] === undefined) {
          alert('단말기를 선택해 주세요')
          return false;
        }
        this.client.publish('/control/get_device_file_list/'+this.active[0].serial_number,JSON.stringify({stb_sn:this.active[0].serial_number, "message":"get_device_file_list"}));
        alert('제어 요청 성공')
      },
      controlDeviceReset () {
        if(this.active[0] === undefined) {
          alert('단말기를 선택해 주세요')
          return false;
        }
        this.client.publish('/control/reset/'+this.active[0].serial_number,JSON.stringify({stb_sn:this.active[0].serial_number}));
        alert('제어 요청 성공')
      },
      updateDevice () {
        axios.put('http://172.16.135.89:3000/camera/'+this.deviceSelected[0]._id,{
          name:this.deviceName ? this.deviceName : this.deviceSelected[0].name,
          location:this.deviceLocation ? this.deviceLocation : this.deviceSelected[0].location,
          gateway_obid:this.gateway ? this.gateway._id : this.deviceSelected[0].gateway_obid._id,
          ip:this.deviceIP ? this.deviceIP : this.deviceSelected[0].ip,
          port:this.port ? parseInt(this.port) : this.deviceSelected[0].port,
          app_version:this.appVersion ? this.appVersion : this.deviceSelected[0].app_version,
          description:this.description ? this.description : this.deviceSelected[0].description,
          protocol:this.protocol ? this.protocol : this.deviceSelected[0].protocol,
          url:this.url ? this.url : this.deviceSelected[0].url,
          account : this.user_id,
        }).then((res) => {
          let index = this.api_v3_device_camera.findIndex(x => x._id == res.data._id)
          this.$set(this.api_v3_device_camera, index, res.data)
          this.batchSettingModal = false
          this.deviceName = null
          this.deviceLocation = null
          this.gateway = null
          this.deviceIP = null
          this.port = null
          this.appVersion = null
          this.description = null
          this.protocol = null
          this.url = null
        })
      },
      cancelUpdateModal () {
        this.batchSettingModal = false
        this.deviceName = null
        this.deviceLocation = null
        this.gateway = null
        this.deviceIP = null
        this.port = null
        this.appVersion = null
        this.description = null
        this.protocol = null
        this.url = null
      },
      cancelDeviceModal() {
        this.addUserModal = false
        this.deviceName = null
        this.deviceLocation = null
        this.deviceIP = null
        this.port = null
        this.gateway = null
        this.appVersion = null
        this.description = null
        this.protocol = null
        this.url = null
      },
      delDevice () {
        if(this.deviceSelected){
          axios.delete('http://172.16.135.89:3000/camera/'+this.deviceSelected[0]._id,{
            data:{
              account : this.user_id
            }
          })
            .then((res) => {
              if(res.data.status === 'Y') {
                --this.online;
              } else if(res.data.status === 'N') {
                --this.offline;
              }
              this.api_v3_device_camera = this.api_v3_device_camera.filter((i) => {
                return i._id !== res.data._id;
              })
            })
        } else {
          alert("단말기를 선택해 주세요")
        }
      },
      addDevice () {
        if(this.deviceRadio === 'gateway') {
          if(this.deviceName === null || this.deviceName === '') {
            alert('게이트웨이 이름을 입력해주세요.');
          } else if(this.deviceLocation === null || this.deviceLocation === '') {
            alert('게이트웨이 위치를 입력해주세요.');
          } else if(this.deviceIP === null || this.deviceIP === '') {
            alert('게이트웨이 IP를 입력해주세요.');
          } else if(this.port === null || this.port === '') {
            alert('포트 번호를 입력해주세요.');
          } else{
            axios.post('http://172.16.135.89:3000/gateway',{
              name:this.deviceName,
              location:this.deviceLocation,
              ip:this.deviceIP,
              port:parseInt(this.port),
              account : this.user_id,
            }).then((res) => {
              this.gatewayList.push(res.data);
              this.addUserModal = false
              this.deviceName = null
              this.deviceLocation = null
              this.deviceIP = null
              this.port = null
              this.gateway = null
              this.appVersion = null
              this.description = null
              this.protocol = null
              this.url = null
            })
          }
        } else {
          if(this.gateway === null || this.gateway === '') {
            alert('게이트웨이를 선택해주세요.');
          } else if(this.deviceName === null || this.deviceName === '') {
            alert('단말기 이름을 입력해주세요.');
          } else if(this.deviceLocation === null || this.deviceLocation === '') {
            alert('단말기 위치를 입력해주세요.');
          } else if(this.serial_number === null || this.serial_number == '') {
            alert('시리얼 넘버를 입력해주세요.');
          } else if(this.description === null || this.description === '') {
            alert('비고를 입력해주세요.');
          } else if(this.protocol === null || this.protocol === '') {
            alert('프로토콜을 선택해주세요.');
          } else if(this.url === null || this.url === '') {
            alert('URL을 입력해주세요.');
          } else {
            if(this.protocol === 'RTSP') this.protocol = 1
            else if(this.protocol === 'ONVIF') this.protocol = 2
            else if(this.protocol === 'GB28181') this.protocol = 3
            axios.post('http://172.16.135.89:3000/camera',{
              name:this.deviceName,
              location:this.deviceLocation,
              account : this.user_id,
              gateway_obid:this.gateway._id,
              serial_number:this.serial_number,
              description:this.description,
              protocol:this.protocol,
              url:this.url,
              app_version:'0.0.0',
              ip:'0.0.0.0',
              port:0,
              status : 'N',
              config_data:{
                capture_time:null,
                capture_status:'N'
              }
            }).then((res) => {
              ++this.offline;
              this.api_v3_device_camera.push(res.data);
              this.addUserModal = false
              this.deviceName = null
              this.deviceLocation = null
              this.serial_number = null
              this.deviceIP = null
              this.port = null
              this.gateway = null
              this.appVersion = null
              this.description = null
              this.protocol = null
              this.url = null
            })
          }
        }
         
      }
    }
  }
</script>
<style src='video.js/dist/video-js.css'></style>