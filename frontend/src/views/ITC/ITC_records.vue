<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-card
        width="25%"
        class="mr-5 elevation-1"
      >
         <v-card-title>
          <v-text-field
            v-model="searchGroup"
            label="검색"
            clearable
            hide-details
            clear-icon="mdi-close-circle-outline"
            append-icon="search"
            style="width:30%;"
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-treeview
            :items="deviceList"
            item-key="_id"
            :active.sync="active"
            :search="searchGroup"
            activatable
            :return-object="true"
          >
            <template v-slot:prepend="{ item }">
              <v-icon
                v-if="!item.children"
                v-text="`dns`"
              ></v-icon>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
      <v-divider vertical></v-divider>
      <v-card width="75%" class="elevation-1">
        <v-row 
        style="height:100%;"
        v-if="!active[0]"
        align="center"
        justify="center">
        단말기를 선택해 주세요
        </v-row>
        <template v-else>
            <v-card-title>
              출입 기록
              <v-spacer></v-spacer>
              <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="dates"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  
              >
                  <template v-slot:activator="{ on }">
                  <v-text-field
                      v-model="dateRangeText"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                      style="width:5%"
                  ></v-text-field>
                  </template>
                  <v-date-picker v-model="dates" no-title scrollable locale="ko" range>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">취소</v-btn>
                  <v-btn text color="primary" @click="clickOk">확인</v-btn>
                  </v-date-picker>
              </v-menu>
              <v-select
                  class="ml-5"
                  :items="deviceStates"
                  v-model="nowStatus"
                  :return-object="true"
                  style="width:5%"
              ></v-select>
              <v-select
                  class="ml-5"
                  :items="['전체','정상온도','온도이상자']"
                  v-model="tempStatus"
                  style="width:5%"
              ></v-select>
            </v-card-title>
            <v-data-table
                :loading="loading" 
                loading-text="불러오는중입니다 잠시만 기다려주세요..."
                :headers="headers"
                :items-per-page="itemsPerPage"
                :page.sync="page"
                @page-count="pageCount = $event"
                hide-default-footer
                :items="accessRecords"
                class="ml-2 mr-2 elevation-0"
            >
                <template v-slot:item.avatar_file_url="{ item }">
                    <img 
                    width="70px"
                    class="mt-1 mb-1"
                    :src="item.avatar_file_url"/>
                </template>
                <template v-slot:item.avatar_type="{ item }">
                    <template v-if="item.avatar_type===1">사원</template>
                    <template v-else-if="item.avatar_type===2">방문자</template>
                    <template v-else-if="item.avatar_type===3">미등록자</template>
                    <template v-else-if="item.avatar_type===4">블랙리스트</template>
                </template>
                <template v-slot:item.avatar_temperature="{ item }">
                    {{item.avatar_temperature.substring(0,4)}}
                </template>
                <template v-slot:item.user_obid="{ item }">
                    <template v-if="item.user_obid">
                        {{item.user_obid.name}}
                    </template>
                </template>
            </v-data-table>
            <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>
  import axios from "axios";
  export default {
    data () {
        return {
            loading:true,
            active:[],
            temperature_max : 40,
            temperature_min : 30,
            searchGroup: '',
            menu : false,
            originData:[],
            accessRecords:[],
            allData:[],
            deviceList : [],
            access : [],
            itemsPerPage: 10,
            page: 1,
            deviceStates : [
                {text:'모든 사용자',value:10},
                {text:'사원',value:1},
                {text:'방문자',value:2},
                {text:'블랙리스트',value:4},
                {text:'미등록자',value:3}
            ],
            tempStatus:'전체',
            nowStatus : {text:'모든 사용자',value:10},
            search : null,
            pageCount: 0,
            headers: [
                { text: '', value: 'avatar_file_url' },
                {
                    text: '타입',
                    align: 'start',
                    value: 'avatar_type',
                },
                { text: '온도', value: 'avatar_temperature' },
                { text: '출입시간', value: 'access_time' },
            ],
            dates: [this.$moment().subtract(1,'days').format('YYYY-MM-DD'), this.$moment().subtract(1,'days').format('YYYY-MM-DD')],
        }
    },
    methods: {
      clickOk () {
            if(this.dates.length === 1 || this.dates[0] === this.dates[1]) {
                this.access = this.originData.filter( (i) =>{
                    return(i.access_time.split(' ')[0] === this.dates[0])
                } )
                this.nowStatus = {text:'모든 사용자',value:10}
                this.tempStatus = '전체';
                console.log(this.access)
            } else {
                if(this.dates[0] > this.dates[1]) {
                    let temp = this.dates[0];
                    this.dates[0] = this.dates[1]
                    this.dates[1] = temp;
                }
                this.access = this.originData.filter( (i) =>{
                    return(i.access_time.split(' ')[0] >= this.dates[0] && i.access_time.split(' ')[0] <= this.dates[1])
                } )
                this.nowStatus = {text:'모든 사용자',value:10}
                this.tempStatus = '전체';
            }
            this.$refs.menu.save(this.dates)
        },
    },
    created () {
       axios.get('http://172.16.135.89:3000/camera')
        .then((res) => {
            this.deviceList = res.data;
        })
        axios.get('http://172.16.135.89:3000/access')
        .then((res) => {
            this.allData = res.data;//모든 데이터
        })
    },
    watch: {
      active : function (newVal) {
        if(newVal[0]) {
          this.originData = this.allData.filter(i => i.stb_sn === newVal[0].serial_number);//선택된 단말의 모든 데이터
          this.accessRecords = this.originData.filter((i) => {
            if(i.access_time.split(' ')[0] === this.dates[0]) {
              return true;
            }
          })
          this.loading=false;
        }
      },
      nowStatus (val) {
        this.tempStatus = '전체'
        if(val.text === '모든 사용자') {
            this.accessRecords = this.access
        } else {
            this.accessRecords = this.access.filter(i => i.avatar_type === val.value)
        }
      },
      tempStatus (val) {
        if(this.nowStatus.value === 10) {
            if(val === '전체') {
            this.accessRecords = this.access
            } else if(val === '온도이상자') {
                this.accessRecords = this.access.filter(i => i.avatar_temperature > '38');
            } else {
                this.accessRecords = this.access.filter(i => i.avatar_temperature <= '38')
            }
        } else {
            if(val === '전체') {
            this.accessRecords = this.access.filter(i => i.avatar_type === this.nowStatus.value)
            } else if(val === '온도이상자') {
                this.accessRecords = this.access.filter(i => i.avatar_type === this.nowStatus.value && i.avatar_temperature > '38');
            } else {
                this.accessRecords = this.access.filter(i => i.avatar_type === this.nowStatus.value && i.avatar_temperature <= '38')
            }
        }
      }
    },
    computed: {
        // accessData () {
            
        //     // return this.access.filter
        // },
        dateRangeText () {
          return this.dates.join(' ~ ')
        },
    },
}
</script>
<style>
  .int-pm .int-pm-btn[data-v-f3939500] {
    border: 1px solid #CCC;
    background-color: #DDD;
    cursor: pointer;
    padding: 1px 10px;
  }
</style>