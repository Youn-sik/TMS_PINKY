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
              <!-- <v-text-field
                v-model="email"
                :counter="45"
                :error-messages="emailErrors"
                label="E-mail"
                required
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              ></v-text-field>
              <v-text-field
                v-model="telephone"
                :error-messages="emailErrors"
                label="Telephone"
                :counter="20"
                required
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              ></v-text-field> -->
              <!-- <v-text-field
                v-model="company"
                label="Company"
                :counter="45"
                required
              ></v-text-field>
              <v-text-field
                v-model="data"
                label="Data"
                :counter="45"
                required
              ></v-text-field> -->
              <!-- <v-select
                v-model="select"
                :items="items"
                :error-messages="selectErrors"
                label="Gender"
                required
                @change="$v.select.$touch()"
                @blur="$v.select.$touch()"
              ></v-select>
              <v-select
                v-model="select"
                :items="items"
                :error-messages="selectErrors"
                label="Employee group"
                required
                @change="$v.select.$touch()"
                @blur="$v.select.$touch()"
              ></v-select>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date"
                    label="Birthday date"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  ref="picker"
                  v-model="date"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1950-01-01"
                  @change="save"
                ></v-date-picker>
              </v-menu> -->
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
              type : 5,
        }).then(() => {
          this.$router.push('/index/blacklist');
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    data: () => ({
      imageData : null,
      date: null,
      menu: false,
      name : null,
      data : null,
      company : null,
      image : null
    }),
  }
</script>


<style>
</style>
