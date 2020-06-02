<template>
  <v-row justify="center">
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
        <!-- {{active}} 선택됨 -->
        <v-card-text>
          <v-treeview
            :items="items"
            :active.sync="active"
            :search="searchGroup"
            activatable
            :open.sync="open"
          >
            <template v-slot:prepend="{ item }">
              <v-icon
                v-if="item.children"
                v-text="`mdi-${item.id === 1 ? 'home-variant' : 'folder-network'}`"
              ></v-icon>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
      <v-divider vertical></v-divider>
      <v-card width="75%">
        <v-card-title>
          <v-text-field
            v-model="searchEmployee"
            label="검색"
            clearable
            hide-details
            clear-icon="mdi-close-circle-outline"
            append-icon="search"
          ></v-text-field>
          <div>
            <v-btn color="error" class="ml-2 mr-2 mt-4" v-if="userSelected[0]" @click="deleteUser"><v-icon dark left>delete_forever</v-icon>삭제</v-btn>
            <v-btn color="error" class="ml-2 mr-2 mt-4" v-else disabled><v-icon dark left>delete_forever</v-icon>삭제</v-btn>
            <v-btn color="primary" class="mt-4 mr-2" v-if="userSelected[0]" dark @click="userUpdateModal=true"><v-icon dark left>settings</v-icon>업데이트</v-btn>
            <v-btn color="error" class="mt-4 mr-2" v-else disabled><v-icon dark left>settings</v-icon>업데이트</v-btn>
            <v-dialog v-model="userUpdateModal" persistent max-width="20%">
              <v-card v-if="userSelected[0]">
                <v-card-title class="headline">사용자 정보 업데이트</v-card-title>
                <v-text-field
                  v-model="name"
                  label="이름"
                  :placeholder="userSelected[0].name"
                  class="ml-2 mr-2"
                ></v-text-field>
                <!-- <v-text-field
                  v-model="company"
                  label="Company"
                  :placeholder="userSelected[0].company"
                  :counter="45"
                  class="ml-2 mr-2"
                ></v-text-field> -->
                <div style="width:80%; margin:0 auto;">
                  <base64-upload class="user"
                  style="width"
                  :imageSrc="image ? image : this.userSelected[0].avatar_file"
                  border="left"
                  @change="onChangeImage"></base64-upload>
                </div>
                
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="updateUser">업데이트</v-btn>
                  <v-btn color="green darken-1" text @click="cancelModal">취소</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn color="primary" class="mt-4" :to="{path : 'addemployee'}"><v-icon dark left>mdi-plus</v-icon>추가</v-btn>
          </div>
        </v-card-title>
        <v-data-table
          v-model="userSelected"
          :single-select="true"
          show-select
          item-key="_id"
          :headers="headers"
          :items="filteredItems"
        >
          <template v-slot:item.avatar_file="{ item }">
            <img 
            width="70px"
            class="mt-1 mb-1"
            :src="'data:image/jpeg;base64,'+item.avatar_file"/>
          </template>
          <template v-slot:item.created_at="{ item }">
            {{item.created_at}}
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    
  </v-row>
</template>


<script> 
  import Base64Upload from 'vue-base64-upload'
  import ALL_USERS from "../../../grahpql/allUser.gql";
  import DELETE_USER from "../../../grahpql/deleteUser.gql";
  import UPDATE_USER from "../../../grahpql/editUser.gql";
  export default {
    computed: {
      filteredItems() {
        if(this.searchEmployee === '') {
          return this.api_v1_person_users
        } else {
          return this.api_v1_person_users.filter((i) => {
            return i.name.indexOf(this.searchEmployee) >= 0;
          })
        }
      }
    },
    data: () => ({
      active:[],
      userSelected:[],
      userUpdateModal: false,
      name:null,
      avatar_file:null,
      image : null,
      api_v1_person_users:[],
      headers: [
          {
            text: '',
            align: 'center',
            value: 'avatar_file',
            width : '10%',
            sortable: false,
          },
          {
            text: '이름',
            align: 'start',
            value: 'name',
          },
          { text: '생성일', value: 'created_at' },
        ],
      items: [
        {
          id: 'Vuetify Human Resources',
          name: 'Vuetify Human Resources',
          children: [
            {
              id: "Core team",
              name: 'Core team',
              children: [
                {
                  id: 201,
                  name: 'John',
                },
                {
                  id: 202,
                  name: 'Kael',
                },
                {
                  id: 203,
                  name: 'Nekosaur',
                },
                {
                  id: 204,
                  name: 'Jacek',
                },
                {
                  id: 205,
                  name: 'Andrew',
                },
              ],
            },
            {
              id: "Administrators",
              name: 'Administrators',
              children: [
                {
                  id: 301,
                  name: 'Ranee',
                },
                {
                  id: 302,
                  name: 'Rachel',
                },
              ],
            },
            {
              id: "Contributors",
              name: 'Contributors',
              children: [
                {
                  id: 401,
                  name: 'Phlow',
                },
                {
                  id: 402,
                  name: 'Brandon',
                },
                {
                  id: 403,
                  name: 'Sean',
                },
              ],
            },
          ],
        },
      ],
      open: [1, 2],
      searchGroup: '',
      searchEmployee : '',
      caseSensitive: false,
    }),
    components: {
      Base64Upload,
    },
    apollo: {
        api_v1_person_users : {
        query : ALL_USERS,
        variables : {
              type : 1,
        },
        error (err) {
          if(err.message.split(':')[2] === ' "유효 하지 않는 토큰 입니다"') {
            document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
            this.$router.push('/');
          }
        }
      }
    },
    // async beforeCreate () {
    //   console.log('beforeCreate')
    //   await this.$apollo.query({
    //       query : ALL_USERS,
    //       variables : {
    //             type : 1,
    //       },
    //     }).catch(async err => {
    //       await console.log(err);
    //       if(err.message.split(':')[2] === ' "유효 하지 않는 토큰 입니다"') {
    //           document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
    //           this.$router.push('/');
    //         }
    //     })
    // },
    // mounted () {
    //   console.log('mounted');
    // },
  methods: {
    async cancelModal() {
      this.userUpdateModal = false;
      setTimeout(() => {
        this.image = null; 
      },300)
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
    deleteUser () {
      if(this.userSelected){
        this.$apollo.mutate({
          mutation : DELETE_USER,
          variables : {
              id : this.userSelected[0]._id,
          },
          update: (store) => {
            const data = store.readQuery({
              query: ALL_USERS,
              variables : {
                type : 1
              }
            })
            data.api_v1_person_users = data.api_v1_person_users.filter(user => {
              return user._id !== this.userSelected[0]._id
            })
            store.writeQuery({
              query : ALL_USERS, 
              data,
              variables : {
                type : 1
              } 
            })
          },
        })
      } else {
        alert("유저를 선택해 주세요")
      }
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
    updateUser () {
      let app_key = this.userSelected[0].app_key;
      let sign = this.userSelected[0].sign;
      let created_at = this.userSelected[0].created_at;
      if(!this.name){
        this.name = this.userSelected[0].name;
      }
      if(!this.image) {
        this.image = this.userSelected[0].avatar_file;
      }
      this.$apollo.mutate({
        mutation : UPDATE_USER,
        variables : {
            _id : this.userSelected[0]._id,
            name : this.name,
            app_key,
            created_at,
            sign,
            timestamp : this.userSelected[0].timestamp,
            avatar_file : this.image,
            updated_at : this.getFormatDate(new Date())
        },
      })
      this.userUpdateModal = false  
      this.name = null;
      this.userSelected = [];
      this.image = null;
    }
  },
}
</script>
