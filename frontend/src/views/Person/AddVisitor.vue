<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-card width="100%" align="center">
        <!-- <v-card-content> -->
          <v-col cols="4">
            <form @submit.prevent="addUser">
              <!-- <div>Identification portrait</div> -->
              <!-- <v-image-input
              class="imageinput"
              v-model="imageData"
              hideActions="ture"
              imageHeight="200"
              imageWidth="200"
            /> -->
              <v-text-field
                v-model="name"
                label="이름"
                required
              ></v-text-field>
              <v-dialog
                v-model="dialog"
                width="500"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="primary"
                    dark
                    v-on="on"
                  >
                    그룹 선택
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title
                    class="headline grey lighten-2"
                    primary-title
                  >
                    그룹 선택
                  </v-card-title>

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
              <base64-upload class="user"
                :imageSrc="this.image"
                border="left"
                @change="onChangeImage"></base64-upload>
              <v-btn class="mr-4" color="primary" @click="addUser">등록</v-btn>
            </form>
          </v-col>
        <!-- </v-card-content> -->
      </v-card>
    </v-col>
    
  </v-row>
</template>


<script>
  import Base64Upload from 'vue-base64-upload'
  import axios from 'axios'
  export default {
    components: {
      Base64Upload,
    },
    watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
    },
    created () {
      axios.get('http://localhost:4000/group?type=2')
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
        /*
        {
          size: 93602,
          filetype: 'image/jpeg',
          filename: 'user.jpg',
          base64:   '/9j/4AAQSkZJRg...'
        }
        */
      },
      getFormatDate(date){
          var year = date.getFullYear();              //yyyy
          var month = (1 + date.getMonth());          //M
          month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
          var day = date.getDate();                   //d
          var hours = date.getHours();
          if(hours < 10) {
            hours = '0' + hours;
          }
          var minutes = date.getMinutes();
          if(minutes < 10) {
            minutes = '0' + minutes;
          }
          var seconds = date.getSeconds();
          if(seconds < 10) {
            seconds = '0' + seconds;
          }
          day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
          return  year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      },
      async addUser(){
        if(this.name === null || this.name === '') {alert('이름을 입력해주세요.'); return false}
        else if(this.image === null || this.image === ''){alert('사진을 업로드 해주세요.'); return false}
        axios.post('http://localhost:4000/user',{
              name : this.name,
              created_at : this.getFormatDate(new Date()),
              avatar_file : this.image,
              groups_obids : this.active[0] === undefined ? null : this.active,
              type : 2,
        }).then(() => {
          this.$router.go(-1);
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    data: () => ({
      active:[],
      date: null,
      menu: false,
      name : null,
      data : null,
      company : null,
      searchGroup : '',
      api_v1_group_group : [],
      dialog: false,
      image : '',
    }),
  }
</script>


<style>
</style>
