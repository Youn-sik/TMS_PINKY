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
            <div class="mb-4">총합</div>
            <v-list-item-title class="headline mb-1">15</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">온라인</div>
            <v-list-item-title class="headline mb-1">12</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">오프라인</div>
            <v-list-item-title class="headline mb-1">3</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="11">
      <v-card>
        <v-card-title>
          단말기 목록
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            label="검색"
            clearable
            hide-details
            clear-icon="mdi-close-circle-outline"
            append-icon="search"
          ></v-text-field>
          <div>
            <v-dialog v-model="addUserModal" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn class="ml-2 mr-2 mt-4" color="primary" dark v-on="on"><v-icon dark left>mdi-plus</v-icon>추가</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">단말기 추가</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-autocomplete
                          :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                          label="단말기 타입"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                          label="단말기 게이트웨이"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                          label="채널"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="단말기 이름*" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="단말기 위치*" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                          label="프로토콜"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="URL" required></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*표시는 필수 항목 입니다</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="addUserModal = false">Close</v-btn>
                  <v-btn color="blue darken-1" text @click="addUserModal = false">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="batchSettingModal" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn class="ml-2 mr-2 mt-4" color="primary" dark v-on="on"><v-icon dark left>settings</v-icon>업데이트</v-btn>
              </template>
              <v-card> 
                <v-card-title>
                  <span class="headline">업데이트</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-autocomplete
                              :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                              label="단말기 타입"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12">
                            <v-autocomplete
                              :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                              label="단말기 게이트웨이"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12">
                            <v-autocomplete
                              :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                              label="채널"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field label="단말기 이름*" required></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field label="단말기 위치*" required></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-autocomplete
                              :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                              label="프로토콜"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field label="URL" required></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
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
            <v-btn class="ml-2 mr-2 mt-4" color="error"><v-icon dark left>delete_forever</v-icon>삭제</v-btn>    
          </div>
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
            text: '단말기 ID',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: '단말기 명', value: 'calories' },
          { text: '위치', value: 'fat' },
          { text: '타입', value: 'carbs' },
          { text: '상태', value: 'protein' },
          { text: '', value: 'data-table-expand' },
        ],
        addUserModal : false,
        batchSettingModal : false,
      }
    },
  }
</script>
<style>
</style>