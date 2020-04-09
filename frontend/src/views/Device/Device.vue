<template>
  <v-row justify="center">
    <v-col cols="11">
      <v-card
        outlined
        elevation="1"
        align="center"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="mb-4">Total</div>
            <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">Employee</div>
            <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">Visitor</div>
            <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="11">
      <v-card>
        <v-card-title>
          Device List
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          item-key="name"
          show-expand
          class="elevation-1"
        >
          <template v-slot:expanded-item="{  }">
            <td :colspan="headers.length" class="deviceTab pa-0">
              <!-- More info about {{ item.name }} -->
              <v-tabs
                v-model="tab"
                background-color="#f9f6f7"
              >
                <v-tab
                  v-for="i in tabs"
                  :key="i"
                >
                  {{i}}
                </v-tab>
                <v-col class="text-right">
                  <v-btn small class="mr-2">Add sub device</v-btn>
                  <v-btn small>Refresh</v-btn>
                </v-col>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item
                  v-for="i in tabs"
                  :key="i"
                >
                  <v-card flat color="#f9f6f7">
                    <v-card-text v-if="i === 'Device information'">
                      <v-col class="d-flex">
                        Basic information
                      </v-col>
                      <v-row justify="center">
                        <v-col cols="8">
                          <p>LDID:</p>
                          <p>Type:</p>
                          <p>Device IP:</p>
                          <p>Device name:</p>
                          <p>Location:</p>
                          <p>Description:</p>
                          <p>First online time:</p>
                          <p>Last offline time:</p>
                          <p>Last update time:</p>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-col class="d-flex">
                        Status Info
                      </v-col>
                      <v-row justify="center">
                        <v-col cols="8">
                          <p>Door Status:</p>
                          <p>Thermal Image Status:</p>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-col class="d-flex">
                        App Information
                      </v-col>
                      <v-row justify="center">
                        <v-col cols="8">
                          <p>App package name:</p>
                          <p>App version name:</p>
                          <p>App version code:</p>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-col class="d-flex">
                        Firmware Information
                      </v-col>
                      <v-row justify="center">
                        <v-col cols="8">
                          <p>Product model:</p>
                          <p>Product Serial Number:</p>
                          <p>Firmware version:</p>
                          <p>Manufacturer:</p>
                          <p>Hardware version code:</p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-text v-else-if="i === 'Device Settings'">
                      디바이스 세팅
                    </v-card-text>
                    <v-card-text v-else-if="i === 'Access Settings'">
                      엑세스 세팅
                    </v-card-text>
                    <v-card-text v-else-if="i === 'Attendance Settings'">
                      어텐던스 세팅
                    </v-card-text>
                    <v-card-text v-else>
                      인물 정보
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
        <v-col cols="11" class="text-right">
      <div class="pa-2">
        <v-dialog v-model="addUserModal" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn class="ma-2" color="primary" dark v-on="on"><v-icon dark left>mdi-plus</v-icon>Device Add</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Add Device</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                      label="Device Type"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                      label="Device Gateway"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                      label="Channel"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Device Name*" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Device location*" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                      label="Protocol"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="URL" required></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="addUserModal = false">Close</v-btn>
              <v-btn color="blue darken-1" text @click="addUserModal = false">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="batchSettingModal" persistent max-width="80%">
          <template v-slot:activator="{ on }">
            <v-btn class="ma-2" color="primary" dark v-on="on"><v-icon dark left>settings</v-icon>Batch setting</v-btn>
          </template>
          <v-card>
           
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-select v-model="color" :items="colors" label="Select Devices"></v-select>
                     <v-card-sub-title class="subtitle-2 pa">Applied devices</v-card-sub-title>
                    <v-data-table
                      v-model="selected"
                      :headers="headers"
                      :items="desserts"
                      item-key="name"
                      show-select
                      class="elevation-1"
                    ></v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="batchSettingModal = false">Close</v-btn>
              <v-btn color="blue darken-1" text @click="batchSettingModal = false">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>  
        <v-btn class="ma-2" color="error"><v-icon dark left>mdi-sync</v-icon>Reboot All</v-btn>    
      </div>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    data () {
      return {
        search: '',
        selected: [],
        tab:null,
        tabs: [
          "Device information",
          "Device Settings",
          "Access Settings",
          "Attendance Settings",
          "Person Info"
        ],
        model: 1,
        expanded: [],
        singleExpand: false,
        headers: [
          {
            text: 'Device ID',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Calories', value: 'calories' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Iron (%)', value: 'iron' },
          { text: '', value: 'data-table-expand' },
        ],
        addUserModal : false,
        batchSettingModal : false,
        desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: '16%',
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: '0%',
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            iron: '2%',
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
            iron: '45%',
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
            iron: '22%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
        ],
      }
    },
  }
</script>
<style>
</style>