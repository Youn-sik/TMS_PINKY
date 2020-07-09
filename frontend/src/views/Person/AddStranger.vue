<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-card width="100%" align="center">
          <v-col cols="4">
            <form @submit.prevent="addUser">
              <v-card-title class="headline" style="padding:10px 0;">미등록자 등록</v-card-title>
              <img :src="image" style="max-width:50%, max-height=50%" alt="">
              <v-text-field
                v-model="name"
                label="이름"
                :rules="nameRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="mobile"
                label="헨드폰 번호"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                label="이메일"
                type="email"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-select 
              :items="[{text:'남자',value:1},{text:'여자',value:2}]"
              v-model="gender">
              </v-select>
              <v-dialog
                v-model="dialog"
                width="500"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="primary"
                    dark
                    class="mr-3"
                    v-on="on"
                  >
                    그룹 선택
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title
                    primary-title
                    style="height:120px"
                  >
                    그룹 선택
                    <v-spacer></v-spacer>
                    <v-col cols="5">
                      <v-select 
                      :items="[{text:'사원', value:1},{text:'방문자', value:2},{text:'블랙리스트', value:5}]" 
                      :return-object="true"
                      v-model="nowStatus"></v-select>
                    </v-col>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-treeview
                      :items="api_v1_group_group"
                      item-key="_id"
                      :active.sync="active"
                      :v-model="active"
                      :multiple-active="true"
                      activatable
                    >
                      <template v-slot:prepend="{ item }">
                        <v-icon
                          v-if="item.children"
                          v-text="`mdi-folder-network`"
                        ></v-icon>
                      </template>
                    </v-treeview>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="dialog = false"
                    >
                      저장
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- <base64-upload class="user"
                :imageSrc="this.image"
                border="left"
                @change="onChangeImage"></base64-upload> -->
              <v-btn class="mr-4" color="primary" @click="addUser">등록</v-btn>
            </form>
          </v-col>
      </v-card>
    </v-col>
    
  </v-row>
</template>


<script>
  // import Base64Upload from '../../components/Base64Upload'
  import axios from 'axios'
  export default {
    // components: {
    //   Base64Upload,
    // },
    props:["isLogin","user_id"],
    watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
      nowStatus(val) {
        axios.get('http://172.16.135.89:3000/group?type='+val.value)
          .then((res) => {
            this.api_v1_group_group = res.data;
          })
      }
    },
    created () {
      this.image = this.$route.params.item.avatar_file_url
      axios.get('http://172.16.135.89:3000/group?type=1')
        .then((res) => {
          this.api_v1_group_group = res.data;
        })
    },
    methods: {
      save (date) {
        this.$refs.menu.save(date)
      },
      onChangeImage(file) {
        this.image = file.base64;
      },
      addUser(){
        if(this.name === null || this.name === '') {alert('이름을 입력해주세요.'); return false}
        else if(this.image === null || this.image === ''){alert('사진을 업로드 해주세요.'); return false}
        else if(this.email !== '' && !/.+@.+\..+/.test(this.email)){alert('이메일 형식으로 입력해주세요.'); return false} 
        axios.post('http://172.16.135.89:3000/user?type=stranger',{
              name : this.name,
              created_at : this.$moment().format('YYYY-MM-DD'),
              avatar_file_url : this.image,
              stranger_id : this.$route.params.item._id,
              groups_obids : this.active[0] === undefined ? null : this.active,
              type : this.nowStatus.value,
              account : this.user_id,
        }).then(() => {
          if(this.nowStatus.value === 1) {
            this.$router.push('/index/employeegroup');
          } else if(this.nowStatus.value === 2) {
            this.$router.push('/index/visitorgroup');
          } else if(this.nowStatus.value === 5) {
            this.$router.push('/index/blacklistgroup');
          }
          
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    data: () => ({
      active:[],
      nowStatus : {text:'사원', value:1},
      date: null,
      email:'',
      emailRules: [
        v => (/.+@.+\..+/.test(v) || v === '') || '이메일 형식으로 입력해주세요.',
      ],
      nameRules: [
        v =>!!v || '필수 입력 정보 입니다.',
      ],
      mobile:'',
      gender:1,
      menu: false,
      name : null,
      data : null,
      company : null,
      api_v1_group_group : [],
      dialog: false,
      image : '',
    }),
  }
</script>


<style>

</style>
