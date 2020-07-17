<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-divider vertical></v-divider>
      <v-card width="100%">
        <v-card-title>
          단말 목록
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="검색"
            single-line
          ></v-text-field>
        </v-card-title>
        <!-- <v-divider></v-divider> -->
        <v-dialog
        v-model="dialog"
        max-width="50vw"
        >
            <v-card>
                <v-card-title>
                    이미지 전체 결과
                </v-card-title>
                <v-card-text style="text-align: center;">
                    <div 
                    v-if="dialogLoading" 
                    style="margin:70px 0 70px 0"
                    >
                      <v-progress-circular
                      indeterminate
                      color="primary"
                      ></v-progress-circular>
                    </div>
                    <template v-else>
                      <v-data-table
                      :headers="headers"
                      :items="monitor_screenshots"
                      :items-per-page="itemsPerPage"
                      :page.sync="page"
                      @page-count="pageCount = $event"
                      hide-default-footer
                      item-key="_id"
                      style="text-align: center"
                      class="elevation-0"
                      >
                        <template v-slot:body="{items}">
                          <tr v-for="item in items" :key="item._id" style="display:inline-block; width:19%; text-align:center;">
                                <td style="width:100%; height=100px;">
                                    <div style="width: 8vw; height: 12vh; margin-top:10px">
                                        <img class="elevation-3" :src="item.upload_url" alt="" @click="click_dialog_img(item.upload_url)" onerror="this.src='http://172.16.135.89:3000/image/noImage.png'" style="width: 100%; max-height: 100%; cursor:pointer">
                                    </div>
                                    <p style="position:relative; bottom:23px; background-color: rgba( 0, 0, 0, 0.5 ); color: #dddddd;">
                                          {{item.regdate}}
                                    </p>
                                </td>
                          </tr>
                        </template>
                      </v-data-table>
                      <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
                    </template>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        style="float: right"
                        @click="dialog = false"
                    >
                        확인
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
          v-model="imageDialog"
          max-width="50vw"
        >
            <v-card>
              <v-img
                :src="image_url"
                class="grey darken-4"
              >
                <v-btn large color="blue darken-2" @click="imageDialog=false" icon style="float: right; position:relative;">
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-img>
            </v-card>
           
        </v-dialog>
        <div 
        v-if="loading"
        style="margin:150px 0 70px 0; text-align: center;"
        >
          <v-progress-circular
          indeterminate
          color="primary"
          ></v-progress-circular>
        </div>
        <template v-else>
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          :items-per-page="itemsPerPage"
          :page.sync="pageTotal"
          :search="search"
          @page-count="pageCountTotal = $event"
          hide-default-footer
          hide-default-header
          item-key="_id"
          class="elevation-0"
        >
            <template v-slot:header="{ props: { headers } }">
              <thead>
                <tr>
                  <th :colspan="headers.length">
                  </th>
                </tr>
              </thead>
            </template>
            <template v-slot:body="{items}">
               <tr v-for="item in items" :key="item.name" style="display:inline-block; width:20%; text-align:center;">
                    <td style="width:100%; height=100px;">
                        <div class="elevation-3" style="width: 15vw; height: 22vh; margin-top:10px">
                            <img :src="item.upload_url" alt="" onerror="this.src='http://172.16.135.89:3000/image/noImage.png'" style="width: 100%; max-height: 100%; cursor:pointer" @click="clickImg(item._id.camera_obids) ">
                        </div>
                        <p style="position:relative; bottom:42px; background-color: rgba( 0, 0, 0, 0.5 ); color: #dddddd; cursor:pointer" @click="clickImg(item._id.camera_obids)">
                                {{item._id.serial_number}}<br/>
                                {{item.lastDate}}
                        </p>
                    </td>
               </tr>
            </template>
        </v-data-table>
        <v-pagination v-model="pageTotal" :total-visible="7" :length="pageCountTotal"></v-pagination>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import axios from 'axios';
  export default {
    computed: {
      filteredItems() {
        return this.api_v3_device_camera_monitor.filter((i) => {
          return !this.search || (i._id.serial_number.indexOf(this.search) >= 0 );
        })
      }
  },
    created () {
        axios.get('http://172.16.135.89:3000/camera_monitor?id=one_device').then((res) => {
            this.api_v3_device_camera_monitor = res.data;
            this.loading = false;
        })
    },
    data () {
      return {
        deviceSelected:[],
        dialog: false,
        loading: true,
        imageDialog:false,
        image_url:'',
        dialogLoading:true,
        itemsPerPage: 10,
        page: 1,
        pageCount: 0,
        pageTotal: 1,
        pageCountTotal: 0,
        api_v3_device_camera_monitor : [],
        monitor_screenshots : [],
        search: '',
        headers: [
          { text: '', value: 'name', sortable: false,filterable: false},
        ],
      }
    },
    methods: {
        click_dialog_img(image_url) {
          this.imageDialog = true;
          this.image_url = image_url
        },
        clickImg(id) {
            this.dialog = true;
            axios.get('http://172.16.135.89:3000/camera_monitor?id='+id).then((res) => {
                this.monitor_screenshots = res.data;
                this.dialogLoading = false 
            })
        },
    }
  }
</script>
<style lang="scss" scoped>
.table-header {
    thead {
        background-color: black;
    }
}
</style>