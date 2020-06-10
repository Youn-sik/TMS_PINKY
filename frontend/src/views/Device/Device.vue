<template>
  <v-row justify="center">
    <v-col cols="11">
      <v-card
        outlined
        elevation="1"
        align="center"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="mb-4">총합</div>
            <v-list-item-title class="headline mb-1">15</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">온라인</div>
            <v-list-item-title class="headline mb-1">12</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">오프라인</div>
            <v-list-item-title class="headline mb-1">3</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="11" class="d-flex">
      <v-card
        width="25%"
      >
         <v-card-title>
          <v-text-field
            v-model="searchGroup"
            label="검색"
            clearable
            hide-details
            clear-icon="mdi-close-circle-outline"
            append-icon="search"
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-treeview
            :items="api_v1_group_group"
            item-key="_id"
            item-disabled="avatar_file"
            :active.sync="active"
            :search="searchGroup"
            activatable
            :multiple-active="false"
            :return-object="true"
            :open.sync="open"
          >
            <template v-slot:prepend="{ item }">
              <v-icon
                v-if="item.children"
                v-text="`mdi-folder-network`"
              ></v-icon>
              <v-icon
                v-else-if="item.avatar_file"
                v-text="`person`"
              ></v-icon>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
      <v-divider vertical></v-divider>
      <v-card width="75%">
        <v-card-title>
          <v-text-field
            v-model="search"
            label="검색"
            clearable
            hide-details
            clear-icon="mdi-close-circle-outline"
            append-icon="search"
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
                  <span class="headline">업데이트</span>
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
                            <v-text-field label="*버전" v-model="appVersion" :placeholder="deviceSelected[0].app_version" required></v-text-field>
                            <v-text-field label="*IP" v-model="deviceIP" :placeholder="deviceSelected[0].ip" required></v-text-field>
                            <v-text-field label="*포트" v-model="port" :placeholder="String(deviceSelected[0].port)" required></v-text-field>
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
                          <v-text-field label="*버전" v-model="appVersion" required></v-text-field>
                          <v-text-field label="*IP" v-model="deviceIP" required></v-text-field>
                          <v-text-field label="*포트" v-model="port" required></v-text-field>
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
          :single-expand='true'
          show-select
          :items="api_v3_device_camera"
          :expanded.sync="expanded"
          item-key="_id"
          show-expand
          class="elevation-1"
        >
          <template v-slot:expanded-item="{  }">
            <td :colspan="headers.length+1" class="deviceTab pa-0">
              <v-tabs
                v-model="tab"
                background-color="#f9f6f7"
              >
                <v-tab
                  v-for="i in tabs"
                  :key="i"
                >
                  {{i}}
                </v-tab>
                <v-col class="text-right">
                  <v-btn small class="mr-2">Add sub device</v-btn>
                  <v-btn small>Refresh</v-btn>
                </v-col>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item
                  v-for="i in tabs"
                  :key="i"
                >
                  <v-card flat color="#f9f6f7">
                    <v-card-text v-if="i === 'Device information'">
                      <v-col class="d-flex">
                        Basic information
                      </v-col>
                      <v-row justify="center">
                        <v-col cols="8">
                          <p>LDID:</p>
                          <p>Type:</p>
                          <p>Device IP:</p>
                          <p>Device name:</p>
                          <p>Location:</p>
                          <p>Description:</p>
                          <p>First online time:</p>
                          <p>Last offline time:</p>
                          <p>Last update time:</p>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-col class="d-flex">
                        Status Info
                      </v-col>
                      <v-row justify="center">
                        <v-col cols="8">
                          <p>Door Status:</p>
                          <p>Thermal Image Status:</p>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-col class="d-flex">
                        App Information
                      </v-col>
                      <v-row justify="center">
                        <v-col cols="8">
                          <p>App package name:</p>
                          <p>App version name:</p>
                          <p>App version code:</p>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-col class="d-flex">
                        Firmware Information
                      </v-col>
                      <v-row justify="center">
                        <v-col cols="8">
                          <p>Product model:</p>
                          <p>Product Serial Number:</p>
                          <p>Firmware version:</p>
                          <p>Manufacturer:</p>
                          <p>Hardware version code:</p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-text v-else-if="i === 'Device Settings'">
                      디바이스 세팅
                    </v-card-text>
                    <v-card-text v-else-if="i === 'Access Settings'">
                      엑세스 세팅
                    </v-card-text>
                    <v-card-text v-else-if="i === 'Attendance Settings'">
                      어텐던스 세팅
                    </v-card-text>
                    <v-card-text v-else>
                      인물 정보
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import axios from 'axios';
  export default {
    created () {
      axios.get('http://localhost:4000/camera').then((res) => {
        this.api_v3_device_camera = res.data;
      })
      axios.get('http://localhost:4000/gateway').then((res) =>{
        this.gatewayList = res.data;
      })
    },
    data () {
      return {
        deviceSelected:[],
        api_v3_device_camera : [],
        search: '',
        selected: [],
        deviceName: null,
        deviceLocation : null,
        deviceIP : null,
        gatewayList : null,
        appVersion : null,
        port : null,
        account : null,
        description : null,
        password : null,
        gateway : null,
        protocol : null,
        url : null,
        tab:null,
        deviceRadio:'gateway',
        tabs: [
          "Device information",
          "Device Settings",
          "Access Settings",
          "Attendance Settings",
          "Person Info"
        ],
        model: 1,
        expanded: [],
        singleExpand: false,
        headers: [
          { text: '단말기 명', value: 'name' },
          { text: '버전', value: 'app_version' },
          { text: '위치', value: 'location' },
          { text: '상태', value: 'status' },
          { text: '', value: 'data-table-expand' },
        ],
        addUserModal : false,
        batchSettingModal : false,
      }
    },
    methods: {
      updateDevice () {
        axios.put('http://localhost:4000/camera/'+this.deviceSelected[0]._id,{
          name:this.deviceName ? this.deviceName : this.deviceSelected[0].name,
          location:this.deviceLocation ? this.deviceLocation : this.deviceSelected[0].location,
          gateway_obid:this.gateway ? this.gateway._id : this.deviceSelected[0].gateway_obid._id,
          ip:this.deviceIP ? this.deviceIP : this.deviceSelected[0].ip,
          port:this.port ? parseInt(this.port) : this.deviceSelected[0].port,
          app_version:this.appVersion ? this.appVersion : this.deviceSelected[0].app_version,
          description:this.description ? this.description : this.deviceSelected[0].description,
          protocol:this.protocol ? this.protocol : this.deviceSelected[0].protocol,
          url:this.url ? this.url : this.deviceSelected[0].url
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
          axios.delete('http://localhost:4000/camera/'+this.deviceSelected[0]._id)
            .then((res) => {
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
            axios.post('http://localhost:4000/gateway',{
              name:this.deviceName,
              location:this.deviceLocation,
              ip:this.deviceIP,
              port:parseInt(this.port),
            }).then(() => {
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
          } else if(this.appVersion === null || this.appVersion === '') {
            alert('버전을 입력해주세요.');
          } else if(this.deviceIP === null || this.deviceIP === '') {
            alert('게이트웨이 IP를 입력해주세요.');
          } else if(this.port === null || this.port === '') {
            alert('포트 번호를 입력해주세요.');
          } else if(this.description === null || this.description === '') {
            alert('비고를 입력해주세요.');
          } else if(this.protocol === null || this.protocol === '') {
            alert('프로토콜을 선택해주세요.');
          } else if(this.url === null || this.url === '') {
            alert('URL을 입력해주세요.');
          } else {
            if(this.protocol === 'RTSP') this.protocol = 1
            else if(this.protocol === 'OMVIF') this.protocol = 2
            else if(this.protocol === 'GB28181') this.protocol = 3
            axios.post('http://localhost:4000/camera',{
              name:this.deviceName,
              location:this.deviceLocation,
              gateway_obid:this.gateway._id,
              ip:this.deviceIP,
              port:parseInt(this.port),
              app_version:this.appVersion,
              description:this.description,
              protocol:this.protocol,
              url:this.url
            }).then((res) => {
              this.api_v3_device_camera.push(res.data);
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
        }
         
      }
    }
  }
</script>
<style>
</style>