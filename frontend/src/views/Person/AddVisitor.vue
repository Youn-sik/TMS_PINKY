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
  // import VImageInput from 'vuetify-image-input';
  import Base64Upload from 'vue-base64-upload'
  import ALL_USERS from "../../../grahpql/allUser.gql";
  import CREATE_USER from "../../../grahpql/addUser.gql";
  
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
        await this.$apollo.mutate({
          mutation : CREATE_USER,
          variables : {
              name : this.name,
              sign : "12345456497489",
              timestamp : this.getFormatDate(new Date()),
              avatar_file : this.image,
              app_key : "12345678",
              type : 2,
          },
          update: (store, { data : {addapi_v1_person_user} }) => {
            const data = store.readQuery({
              query: ALL_USERS,
              // variables: { _id: addapi_v1_person_user._id, app_key: addapi_v1_person_user.app_key, name: addapi_v1_person_user.name, avatar_file: addapi_v1_person_user.avatar_file, timestamp: addapi_v1_person_user.timestamp}
              variables : {
                type : 2
              }
            })
            data.api_v1_person_users.push(addapi_v1_person_user)
            store.writeQuery({query: ALL_USERS, data })
          },
        }).then(() =>{
          this.$router.push('/index/visitor');
        })
        
      }
    },
    data: () => ({
      imageData : null,
      date: null,
      menu: false,
      name : null,
      data : null,
      company : null,
      image : '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',
    }),
  }
</script>


<style>
</style>
