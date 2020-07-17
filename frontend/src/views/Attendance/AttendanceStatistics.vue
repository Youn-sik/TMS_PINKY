<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-card-title>
                    출근 기록
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
                        <v-btn text color="primary" @click="clickOK">확인</v-btn>
                        </v-date-picker>
                    </v-menu>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="검색"
                        single-line
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                    :loading="loading" 
                    loading-text="불러오는중입니다 잠시만 기다려주세요..."
                    :headers="headers"
                    :items="user"
                    :items-per-page="itemsPerPage"
                    :page.sync="page"
                    :search="search"
                    @page-count="pageCount = $event"
                    hide-default-footer
                    class="ml-2 mr-2 elevation-0"
                >
                    <template v-slot:no-data>
                        <div style="height:75vh; font-size:2em">
                            <v-row justify="center" align="center" style="height:100%;">
                                데이터가 없습니다
                            </v-row>
                        </div>
                    </template>
                    <template v-slot:item.avatar_file_url="{ item }">
                        <v-row justify="center" align="center" style="height:110px;">
                        <img 
                        width="70px;"
                        style="max-height:100px;"
                        :src="item.avatar_file_url"/>
                        </v-row>
                    </template>
                    <!-- <template v-slot:item.attendance="{ item }">
                        <template v-if="item.attendance">
                            {{item.attendance}}
                        </template>
                        <template v-else>
                            0
                        </template>
                    </template>
                    <template v-slot:item.late="{ item }">
                        <template v-if="item.late">
                            {{item.late}}
                        </template>
                        <template v-else>
                            0
                        </template>
                    </template> -->
                </v-data-table>
                <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import axios from 'axios';
export default {
    async beforeCreate () {
        await axios.get('http://172.16.135.89:3000/user?type=1')
            .then((res) => {
                this.user = res.data;
                this.loading=false
                this.clickOK()
            })  
        axios.get('http://172.16.135.89:3000/access?type=attendance')
            .then((res) => {
                this.accessOrigin = res.data;
            })
        
    },
    methods: {
        clickOK() {
            this.user.map((i,index) => {
                this.$set(this.user[index],'late',0);
                this.$set(this.user[index],'attendance',0);
            })
            if(this.dates.length === 1 || this.dates[0] === this.dates[1]) {
                this.access = this.accessOrigin.filter(i => i.access_time.split(' ')[0] === this.dates[0]);
            } else {
                if(this.dates[0] > this.dates[1]) {
                    let temp = this.dates[0]
                    this.dates[0] = this.dates[1]
                    this.dates[1] = temp;
                }
                this.access = this.accessOrigin.filter(i => i.access_time.split(' ')[0] >= this.dates[0] && i.access_time.split(' ')[0] <= this.dates[1]);
            }
            this.access.map((i,accessIndex) => {
                if(accessIndex > 0 && this.access[accessIndex-1].avatar_contraction_data === i.avatar_contraction_data && this.access[accessIndex-1].access_time.split(' ')[0] === i.access_time.split(' ')[0]){
                    return false;
                }
                let index = this.user.findIndex(j => j.avatar_contraction_data === i.avatar_contraction_data);
                if(index !== -1){
                    if(i.access_time.split(' ')[1] > '09:00:00') {
                        this.$set(this.user[index],'late',++this.user[index].late);
                    } else {
                        this.$set(this.user[index],'attendance',++this.user[index].attendance);
                    }
                }    
            })
            this.$refs.menu.save(this.dates)
        }
    },
    computed: {
        dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    data () {
        return {
            access:[],
            loading:true,
            accessOrigin:[],
            user:[
                {},
            ],
            avatar:'',
            date:'',
            search:'',
            menu:false,
            itemsPerPage: 10,
            page: 1,
            pageCount: 0,
            dates: [this.$moment(Date.now()).format('YYYY-MM-DD'), this.$moment(Date.now()).format('YYYY-MM-DD')],
            headers: [
                {
                    text: '',
                    value: 'avatar_file_url',
                    filterable: false,
                },
                {
                    text: '이름',
                    align: 'start',
                    value: 'name',
                },
                { text: '부서' },
                { text: 'ID' },
                { text: '직위' },
                { text: '출근',filterable: false ,value: 'attendance'},
                { text: '지각',filterable: false ,value: 'late'},
                { text: '결근',filterable: false },
                { text: '조퇴',filterable: false },
            ],
        }
    }
}
</script>
<style>

</style>