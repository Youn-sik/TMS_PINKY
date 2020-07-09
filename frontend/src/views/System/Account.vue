<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-card-title>
                    계정 관리
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="검색"
                        single-line
                    ></v-text-field>
                    <div>
                        <v-btn class="ml-2" color="error" v-if="selected[0]" @click="deleteAccount"><v-icon dark left>delete_forever</v-icon>삭제</v-btn>
                        <v-btn class="ml-2" color="error" disabled="disabled" v-else><v-icon dark left>delete_forever</v-icon>삭제</v-btn>
                        <v-btn class="ml-2" color="primary" v-if="selected[0]" @click="dialog = true"><v-icon dark left>settings</v-icon>업데이트</v-btn>
                        <v-btn class="ml-2" color="primary" disabled="disabled" v-else><v-icon dark left>settings</v-icon>업데이트</v-btn>
                        <v-dialog v-model="dialog" persistent max-width="20%">
                            <v-card v-if="selected[0]">
                                <v-card-title class="headline">계정 업데이트</v-card-title>
                                <v-card-text style="text-align: center; padding:0 20%; margin-top:10px;">
                                    <v-text-field
                                        v-model="user_name"
                                        :placeholder="selected[0].user_name"
                                        label="이름"
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
                                <v-btn color="blue darken-1" text @click="updateAccount">저장</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-btn class="ml-2" color="primary" @click="$router.push('/index/system/account/add')"><v-icon dark left>mdi-plus</v-icon>추가</v-btn>
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
                    :search="search"
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
    props:["isLogin","user_id"],
    created () {
        axios.get('http://172.16.135.89:3000/account')
            .then((res) => {
                this.accounts = res.data;
            })
    },
    methods: {
        updateAccount() {
            if(confirm('변경된 사항은 되돌릴수 없습니다 변경하시겠습니까?')) {
                axios.put('http://172.16.135.89:3000/account/'+this.selected[0]._id,{
                    account : this.user_id,
                    user_name : !this.user_name ? undefined : this.user_name,
                    user_pw : !this.user_pw ? undefined : this.user_pw,
                    user_lang : !this.user_lang ? undefined : this.user_lang
                }).then((res) => {
                    let index = this.accounts.findIndex(account => account._id === res.data._id)
                    this.$set(this.accounts,index,res.data)
                    // this.accounts[index] = res.data;
                    this.selected = [];
                    alert('변경 되었습니다.');
                    this.dialog = false;
                })
            }
        },
        deleteAccount() {
            if(confirm('정말로 삭제하시겠습니까?')) {
                axios.delete('http://172.16.135.89:3000/account/'+this.selected[0]._id,{
                    data:{
                        account : this.user_id
                    }
                })
                .then((res) => {
                    let temp = this.accounts.filter((account) => {
                        return account._id !== res.data._id
                    })
                    this.accounts = temp;
                    this.selected = [];
                    alert('삭제 되었습니다.');
                })
            }
        }
    },
    data: () => ({
        selected : [],
        user_name:'',
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