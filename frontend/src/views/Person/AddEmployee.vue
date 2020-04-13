<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-card width="100%" align="center">
        <!-- <v-card-content> -->
          <v-col cols="4">
            <form @submit.prevent="addUser">
              <div>Identification portrait</div>
              <!-- <v-image-input
              class="imageinput"
              v-model="imageData"
              hideActions="ture"
              imageHeight="200"
              imageWidth="200"
            /> -->
              <v-text-field
                v-model="name"
                label="Name"
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
              <v-text-field
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
              ></v-text-field>
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
  import ALL_USERS from "../../../grahpql/allUser.gql";
  import CREATE_USER from "../../../grahpql/addUser.gql";
  export default {
    data: () => ({
      imageData : null,
      date: null,
      menu: false,
      name : null,
      data : null,
      company : null
    }),
    components: {
      // VImageInput,
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
      async addUser(){
        await this.$apollo.mutate({
          mutation : CREATE_USER,
          variables : {
              name : this.name,
              company : this.company,
              data : this.data,
          },
          update: (store, { data: { addauthorized_access } }) => {
            const data = store.readQuery({
              query: ALL_USERS
            })
            
            data.authorized_accesss.push(addauthorized_access)
            store.writeQuery({ ALL_USERS, data })
          },
        }).then(() =>{
          this.$router.push('/index/employee');
        })
        
      }
    },
  }
</script>


<style>
</style>
