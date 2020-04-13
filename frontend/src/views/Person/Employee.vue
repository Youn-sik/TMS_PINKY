<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-card
        width="25%"
      >
         <v-card-title>
          <v-text-field
            v-model="search"
            label="Search Company Directory"
            clearable
            hide-details
            clear-icon="mdi-close-circle-outline"
            append-icon="search"
          ></v-text-field>
        </v-card-title>
        {{active}} 선택됨
        <v-card-text>
          <v-treeview
            :items="items"
            :active.sync="active"
            :search="search"
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
            v-model="search"
            label="Search Company Directory"
            clearable
            hide-details
            clear-icon="mdi-close-circle-outline"
            append-icon="search"
          ></v-text-field>
          <div>
            <v-btn color="error" class="ml-2 mr-2 mt-4" v-if="userSelected[0]" @click="deleteUser">Delete</v-btn>
            <v-btn color="error" class="ml-2 mr-2 mt-4" v-else disabled>Delete</v-btn>
            <v-btn color="primary" class="mt-4 mr-2" v-if="userSelected[0]" dark @click="userUpdateModal=true">Update</v-btn>
            <v-btn color="error" class="mt-4 mr-2" v-else disabled>Update</v-btn>
            <v-dialog v-model="userUpdateModal" persistent max-width="20%">
              <v-card v-if="userSelected[0]">
                <v-card-title class="headline">User Update</v-card-title>
                <v-text-field
                  v-model="name"
                  label="Name"
                  :placeholder="userSelected[0].name"
                  class="ml-2 mr-2"
                ></v-text-field>
                <v-text-field
                  v-model="company"
                  label="Company"
                  :placeholder="userSelected[0].company"
                  :counter="45"
                  class="ml-2 mr-2"
                ></v-text-field>
                <v-text-field
                  v-model="data"
                  label="Data"
                  :placeholder="userSelected[0].data"
                  :counter="45"
                  class="ml-2 mr-2"
                ></v-text-field>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="updateUser">Update</v-btn>
                  <v-btn color="green darken-1" text @click="userUpdateModal = false">cancel</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn color="primary" class="mt-4" :to="{path : 'addemployee'}">Add to Group</v-btn>
          </div>
        </v-card-title>
        <v-data-table
          v-model="userSelected"
          :single-select="true"
          show-select
          item-key="_id"
          :headers="headers"
          :items="authorized_accesss"
          :search="search"
        ></v-data-table>
      </v-card>
    </v-col>
    
  </v-row>
</template>


<script> 
  import ALL_USERS from "../../../grahpql/allUser.gql";
  import DELETE_USER from "../../../grahpql/deleteUser.gql";
  import UPDATE_USER from "../../../grahpql/editUser.gql";
  export default {
    data: () => ({
      active:[],
      userSelected:[],
      userUpdateModal: false,
      name:null,
      company:null,
      data:null,
      authorized_accesss:[],
      headers: [
          {
            text: '이름',
            align: 'start',
            value: 'name',
          },
          { text: '소속 회사', value: 'company' },
          { text:'정보', value: 'data'}
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
      search: null,
      caseSensitive: false,
    }),
    apollo: {
      authorized_accesss : {
        query : ALL_USERS,
      variables () {
        return {
          authorized_accesss : this.authorized_accesss,
        }
      },
    }
  },
  methods: {
    deleteUser () {
      if(this.userSelected){
        this.$apollo.mutate({
          mutation : DELETE_USER,
          variables : {
              id : this.userSelected[0]._id,
          },
          update: (store) => {
            const data = store.readQuery({
              query: ALL_USERS
            })
            data.authorized_accesss = data.authorized_accesss.filter(user => {
              return user._id !== this.userSelected[0]._id
            })
            store.writeQuery({query : ALL_USERS, data })
          },
        })
      } else {
        alert("유저를 선택해 주세요")
      }
    },
    updateUser () {
      if(!this.name){
        this.name = this.userSelected[0].name;
      }
      if(!this.company) {
        this.company = this.userSelected[0].company;
      }
      if(!this.data) {
        this.data = this.userSelected[0].data;
      }
      this.$apollo.mutate({
        mutation : UPDATE_USER,
        variables : {
            id : this.userSelected[0]._id,
            name : this.name,
            company : this.company,
            data : this.data,
        },
      })
      this.userUpdateModal = false  
      this.name = null;
      this.userSelected = [];
      this.company = null;
      this.data = null;
    }
  },
}
</script>
