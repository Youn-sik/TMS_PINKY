<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-row justify="center" >
                    <v-col cols="3" class="text-center">
                        <v-card-title class="headline" style="padding:10px 0;">계정 생성</v-card-title>
                        <v-text-field
                            v-model="user_name"
                            label="이름"
                        ></v-text-field>
                        <v-text-field
                            v-model="id"
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
                        <v-btn color="primary" @click="addAccount">등록</v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import axios from 'axios'
export default {
    props:["isLogin","user_id"],
    methods : {
        addAccount () {
            if(this.user_name === '') {
                alert('이름을 입력해주세요')
            } else if (this.id === '') {
                alert('아이디를 입력해주세요')
            } else if (this.user_pw === '') {
                alert('비밀번호를 입력해주세요')
            } else if (this.user_pw_chk === '' || this.user_pw_chk !== this.user_pw) {
                alert('비밀번호가 같지 않습니다')
            } else if (this.user_lang === '') {
                alert('언어를 선택해주세요')
            } else {
                axios.post('http://172.16.135.89:3000/account',{
                    user_name : this.user_name,
                    user_id : this.id,
                    user_pw : this.user_pw,
                    user_lang : this.user_lang,
                    account : this.id,
                })
                .then(() => {
                    this.$router.go(-1);
                })
            }   
        }
    },
    data: () => ({
        user_name : '',
        id : '',
        user_pw : '',
        user_lang : '',
        user_pw_chk : ''
    })
}
</script>