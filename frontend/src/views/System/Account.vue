<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-card-title>
                    <v-text-field
                        v-model="search"
                        label="검색"
                        clearable
                        hide-details
                        clear-icon="mdi-close-circle-outline"
                        append-icon="search"
                    ></v-text-field>
                    <div>
                        <v-btn class="ml-2 mt-3" color="error" v-if="selected[0]" @click="deleteAccount"><v-icon dark left>delete_forever</v-icon>삭제</v-btn>
                        <v-btn class="ml-2 mt-3" color="error" disabled="disabled" v-else><v-icon dark left>delete_forever</v-icon>삭제</v-btn>
                        <v-btn class="ml-2 mt-3" color="primary" v-if="selected[0]" @click="dialog = true"><v-icon dark left>settings</v-icon>업데이트</v-btn>
                        <v-btn class="ml-2 mt-3" color="primary" disabled="disabled" v-else><v-icon dark left>settings</v-icon>업데이트</v-btn>
                        <v-dialog v-model="dialog" persistent max-width="40%">
                            <v-card v-if="selected[0]">
                                <v-card-title class="headline"></v-card-title>
                                <v-card-text>
                                    <v-text-field
                                        v-model="user_name"
                                        :placeholder="selected[0].user_name"
                                        label="이름"
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="user_id"
                                        :placeholder="selected[0].user_id"
                                        label="ID"
                                    ></v-text-field>
                                    <v-text-field
                                        type="password"
                                        v-model="user_pw"
                                        label="비밀번호"
                                    ></v-text-field>
                                    <v-text-field
                                        type="password"
                                        v-model="user_pw_chk"
                                        label="비밀번호 확인"
                                    ></v-text-field>
                                    <div class="error--text" v-if="user_pw !== '' && user_pw_chk !== '' && user_pw_chk !== user_pw">
                                        비밀번호가 같지 않습니다!
                                    </div>
                                    <v-select
                                        v-model="user_lang"
                                        :items="['KOR', 'ENG']"
                                        label="언어"
                                    ></v-select>
                                </v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialog = false">취소</v-btn>
                                <v-btn color="blue darken-1" text @click="dialog = false">저장</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-btn class="ml-2 mt-3" color="primary" @click="$router.push('/index/addaccount')"><v-icon dark left>mdi-plus</v-icon>추가</v-btn>
                    </div>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="accounts"
                    show-select
                    :items-per-page="itemsPerPage"
                    :page.sync="page"
                    @page-count="pageCount = $event"
                    hide-default-footer
                    :single-select="true"
                    v-model="selected"
                    item-key="_id"
                    class="ml-2 mr-2 elevation-0"
                ></v-data-table>
                <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import axios from 'axios'
export default {
    created () {
        axios.get('http://172.16.135.89:3000/account')
            .then((res) => {
                this.accounts = res.data;
            })
    },
    methods: {
        updateAccount() {
            
        },
        deleteAccount() {
            axios.delete('http://172.16.135.89:3000/account/'+this.selected[0]._id)
                .then((res) => {
                    let temp = this.accounts.filter((account) => {
                        return account._id !== res.data._id
                    })
                    this.accounts = temp;
                    this.selected = [];
                })
        }
    },
    data: () => ({
        selected : [],
        user_name:'',
        user_id:'',
        itemsPerPage: 10,
        page: 1,
        pageCount: 0,
        user_pw:'',
        user_pw_chk:'',
        user_lang:'',
        search:'',
        dialog:false,
        headers: [
            { text: 'ID', value: 'user_id' },
            { text: '이름', value: 'user_name' },
            { text: '권한', value: 'user_auth' },
            { text: '언어', value: 'user_lang' },
        ],
        accounts : []
    })
}
</script>