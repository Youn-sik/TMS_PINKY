<template>
  <v-row justify="center">
    <v-col cols="11">
      <v-card>
        <v-row justify="center">
            <div class="mr-3 mt-10">
                사진 업로드 :
            </div>
            <div style="width:15vw;" class="mt-10">
                <base64-upload class="user mb-3"
                :imageSrc="this.image"
                border="left"
                @change="onChangeImage"></base64-upload>
            </div>
        </v-row>
        <v-row justify="center">
            <div class="mr-1">
              임계 값:
            </div>
            <integer-plusminus
                   :max="10"
                   v-model="compare">
              {{ compare }}
            </integer-plusminus>

            <div class="mr-1 ml-3">
              TOP N:
            </div>
            <integer-plusminus
                   :max="10"
                   v-model="top_n">
              {{ top_n }}
            </integer-plusminus>
        </v-row>
        <v-card-title>
          검색 결과
        </v-card-title>
        <v-data-table
          :headers="headers"
          item-key="_id"
          class="elevation-0"
        >
           <template v-slot:item.avatar_file="{ item }">
            <img 
            width="70px"
            class="mt-1 mb-1"
            :src="'data:image/jpeg;base64,'+item.avatar_file"/>
          </template>
          <template v-slot:item.type="{ item }">
            <template v-if="item.type === 1">
              사원
            </template>
            <template v-else-if="item.type === 2">
              방문자
            </template>
            <template v-else>
              블랙리스트
            </template>
          </template>
          <template v-slot:item.created_at="{ item }">
            {{item.created_at}}
          </template>
        </v-data-table>
        <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import Base64Upload from '../../components/Base64Upload'
  import { IntegerPlusminus } from 'vue-integer-plusminus'
  export default {
    data: () => ({
        image : null,
        compare : 0,
        itemsPerPage: 10,
        page: 1,
        pageCount: 0,
        top_n : 0,
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
    }),
    methods : {
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
    },
    components: {
      Base64Upload,
      IntegerPlusminus
    },
  }
</script>
<style>
  .int-pm .int-pm-btn[data-v-f3939500] {
    border: 1px solid #CCC;
    background-color: #DDD;
    cursor: pointer;
    padding: 1px 10px;
  }
</style>