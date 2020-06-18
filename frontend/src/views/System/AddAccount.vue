<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-row justify="center" >
                    <v-col cols="3" class="text-center">
                        <v-text-field
                            v-model="user_name"
                            label="이름"
                        ></v-text-field>
                        <v-text-field
                            v-model="user_id"
                            label="ID"
                        ></v-text-field>
                        <v-text-field
                            type="password"
                            v-model="user_pw"
                            label="비밀번호"
                        ></v-text-field>
                        <v-text-field
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
    methods : {
        addAccount () {
            if(this.user_name === '') {
                alert('이름을 입력해주세요')
            } else if (this.user_id === '') {
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
                    user_id : this.user_id,
                    user_pw : this.user_pw,
                    user_lang : this.user_lang
                })
                .then(() => {
                    this.$router.go(-1);
                })
            }   
        }
    },
    data: () => ({
        user_name : '',
        user_id : '',
        user_pw : '',
        user_lang : '',
        user_pw_chk : ''
    })
}
</script>