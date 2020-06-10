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
            style="width:30%;"
          ></v-text-field>
          <!-- <v-btn color="primary" class="ml-2 mt-4"><v-icon dark left>mdi-plus</v-icon>추가</v-btn> -->

              <v-btn color="primary" class="ml-2 mt-4" @click="clickDialogBtn">
               <v-icon dark left>mdi-plus</v-icon>추가
              </v-btn>
          <v-dialog
            v-model="dialog"
            width="500"
          >
            <!-- <template v-slot:activator="{ on }"> -->
            <!-- </template> -->

            <v-card>
              <v-card-title
                class="headline grey lighten-2"
                primary-title
              >
                그룹 추가
              </v-card-title>

              <v-card-text>
                <v-text-field
                  v-model="groupName"
                  label="그룹 이름"
                  class="ml-2 mr-2 mt-2"
                ></v-text-field>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="addGroup"
                >
                  추가
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-title>
        <v-card-text>
          <v-treeview
            :items="api_v1_group_group"
            item-key="_id"
            :active.sync="active"
            :search="searchGroup"
            item-disabled="avatar_file"
            activatable
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
            v-model="searchEmployee"
            label="검색"
            clearable
            hide-details
            clear-icon="mdi-close-circle-outline"
            append-icon="search"
            style="width:50%;"
          ></v-text-field>
          <div>
            <v-btn color="error" class="ml-2 mr-2 mt-4" v-if="userSelected[0]" @click="deleteUser"><v-icon dark left>delete_forever</v-icon>삭제</v-btn>
            <v-btn color="error" class="ml-2 mr-2 mt-4" v-else disabled><v-icon dark left>delete_forever</v-icon>삭제</v-btn>
            <v-btn color="primary" class="mt-4 mr-2" v-if="userSelected[0]" dark @click="clickUpdate"><v-icon dark left>settings</v-icon>업데이트</v-btn>
            <v-btn color="error" class="mt-4 mr-2" v-else disabled><v-icon dark left>settings</v-icon>업데이트</v-btn>
            <v-dialog v-model="userUpdateModal" persistent max-width="50%">
              <v-card v-if="userSelected[0]">
                <v-card-title class="headline">사용자 정보 업데이트</v-card-title>
                <v-col class="d-flex">
                  <v-col cols="5">
                    <v-treeview
                      :items="api_v1_group_group"
                      item-key="_id"
                      :active.sync="updateActive"
                      :multiple-active="true"
                      item-disabled="avatar_file"
                      activatable
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
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col cols="6">
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
                      :imageSrc="image ? image : 'http://localhost:4000/'+this.userSelected[0].avatar_file"
                      border="left"
                      @change="onChangeImage"></base64-upload>
                    </div>
                  </v-col>
                </v-col>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="updateUser">업데이트</v-btn>
                  <v-btn color="green darken-1" text @click="cancelModal">취소</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn color="primary" class="mt-4" :to="{path : 'addblacklist'}"><v-icon dark left>mdi-plus</v-icon>추가</v-btn>
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
            :src="'http://localhost:4000/'+item.avatar_file"/>
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
  import axios from "axios";
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
      },
    },
    components: {
      Base64Upload,
    },
    data: () => ({
      active:[],
      updateActive:[],
      userSelected:[],
      userUpdateModal: false,
      dialog: false,
      name:null,
      groupName:null,
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
      api_v1_group_group : [],
      open: [1, 2],
      searchGroup: '',
      searchEmployee : '',
      caseSensitive: false,
    }),
    watch : {
      active : function (newVal) {
        if (newVal[0] === undefined){
          return false;
        } else if(newVal[0].avatar_file !== undefined) {
          return false;
        }
        this.api_v1_person_users = newVal[0].user_obids;
      }
    },
    created () {
      // axios.get('http://localhost:4000/user?type=5')
      //   .then((res) => {
      //     this.api_v1_person_users = res.data
      //   })
      axios.get('http://localhost:4000/group?type=5')
        .then((res) => {
          res.data.map((i) => {//user_obids에 있는 데이터 children으로 옮기기
            this.moveUserIds(i);
          })
          let index = res.data.findIndex(i => i.name == "undefined");
          if(index !== -1) {
            let undefinedGroup = res.data.splice(index,1);
            res.data.push(undefinedGroup[0]);
          }
          this.api_v1_group_group = res.data;
        })
    },
  methods: {
    clickUpdate () {
      this.updateActive = this.userSelected[0].groups_obids;
      // console.log(this.userSelected[0]);
      this.userUpdateModal = true;
    },
    clickDialogBtn () {
      if(this.active[0] !== undefined && this.active[0].rootParent !== undefined) {
        alert('3차 그룹까지만 추가 할 수 있습니다')
        return false;
      } else if(this.active[0] !== undefined && this.active[0].avatar_file !== undefined) {
        alert('그룹을 선택 해 주세요');
        return false;
      }
      this.dialog = true;
    },
    addGroup () {
       if(this.groupName === null || this.groupName === '') {
        alert('이름을 입력해주세요');
        this.dialog = false;
        return false;
      }
      const parent = this.active[0]
      axios.post('http://localhost:4000/group',{
        name : this.groupName,
        type : 5,
        parent,
      }).then((res) => {
        if(this.active[0] === undefined && this.api_v1_group_group.length === 0) {
          this.api_v1_group_group.push(res.data);
        } else if(this.api_v1_group_group[this.api_v1_group_group.length - 1].name === 'undefined') {
          this.api_v1_group_group.splice(this.api_v1_group_group.length-1,0,res.data)
        } else if(this.active[0] === undefined) {
          this.api_v1_group_group.push(res.data);
        } else if(this.active[0].children.length >= 1){
          this.active[0].children.map((i,index) => {
            if(i.avatar_file !== undefined) {
              this.active[0].children.splice(index,0,res.data)
            } else if(index === this.active[0].children.length-1) {
              this.active[0].children.push(res.data)
            }
          })
        } else {
          this.active[0].children.push(res.data)
        }
        this.groupName = null;
        this.dialog = false;
      })
    },
    async cancelModal() {
      this.userUpdateModal = false;
      setTimeout(() => {
        this.image = null; 
      },300)
    },
    moveUserIds (data)  {
      if(data.children[0] !== undefined) {
          data.children.map((i) => {
              this.moveUserIds(i)
          })
      }
      if(data.user_obids[0] !== undefined) {
        data.children = data.children.concat(data.user_obids);
      }
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
        axios.delete('http://localhost:4000/user/'+this.userSelected[0]._id,{
          type : 5,
          _id:this.userSelected[0]._id
        })
          .then((res) => {
            this.api_v1_person_users = this.api_v1_person_users.filter((i) => {
              return i._id !== res.data._id;
            })
            axios.get('http://localhost:4000/group?type=5')
              .then((res) => {
                res.data.map((i) => {//user_obids에 있는 데이터 children으로 옮기기
                  this.moveUserIds(i);
                })
                let index = res.data.findIndex(i => i.name == "undefined");
                if(index !== -1) {
                  let undefinedGroup = res.data.splice(index,1);
                  res.data.push(undefinedGroup[0]);
                }
                this.api_v1_group_group = res.data;
              })
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
      if(!this.name){
        this.name = this.userSelected[0].name;
      }
      if(!this.image) {
        this.image = this.userSelected[0].avatar_file;
      }
      axios.put('http://localhost:4000/user/'+this.userSelected[0]._id,{
        _id : this.userSelected[0]._id,
        name : this.name,
        avatar_file : this.image,
        updated_at : this.getFormatDate(new Date()),
        groups_obids : this.userSelected[0].groups_obids,
        clicked_groups : this.updateActive,
        type : 5
      }).then((res) => {
        let index = this.api_v1_person_users.findIndex(x => x._id == res.data._id)
        this.api_v1_person_users[index].name = res.data.name;
        this.api_v1_person_users[index].avatar_file = res.data.avatar_file;
        this.api_v1_person_users[index].updated_at = res.data.updated_at;
        axios.get('http://localhost:4000/group?type=5')
          .then((res) => {
            res.data.map((i) => {//user_obids에 있는 데이터 children으로 옮기기
              this.moveUserIds(i);
            })
            let index = res.data.findIndex(i => i.name == "undefined");
            if(index !== -1) {
              let undefinedGroup = res.data.splice(index,1);
              res.data.push(undefinedGroup[0]);
            }
            this.api_v1_group_group = res.data;
          })
      })
      this.userUpdateModal = false  
      this.name = null;
      this.userSelected = [];
      this.image = null;
    }
  },
}
</script>
