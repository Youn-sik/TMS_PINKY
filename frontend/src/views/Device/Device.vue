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
              >
                <v-tab
                  v-for="i in tabs"
                  :key="i"
                >
                  {{i}}
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item
                  v-for="i in tabs"
                  :key="i"
                >
                  <v-card flat>
                    <v-card-text>
                      {{ i }}
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
            <v-btn class="ma-2" color="error"><v-icon dark left>mdi-sync</v-icon>Reboot All</v-btn>
            <v-btn class="ma-2" color="primary" dark v-on="on"><v-icon dark left>settings</v-icon>Batch setting</v-btn>
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
      </div>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    data () {
      return {
        search: '',
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