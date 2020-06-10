<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-card-title>
                    <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="dates"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                        
                    >
                        <template v-slot:activator="{ on }">
                        <v-text-field
                            v-model="dateRangeText"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                            style="width:5%"
                        ></v-text-field>
                        </template>
                        <v-date-picker v-model="dates" no-title scrollable range>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                    <v-select
                        class="ml-5"
                        :items="deviceStates"
                        v-model="nowStatus"
                        style="width:5%"
                    ></v-select>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="검색"
                        single-line
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="desserts"
                    :items-per-page="5"
                    class="ml-2 mr-2 elevation-0"
                ></v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
export default {
    computed: {
        dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    data: () => ({
        deviceStates : [
            '모든 사용자',
            '사원',
            '방문자',
            '블랙리스트',
        ],
        nowStatus : '모든 사용자',
        dates: ['2019-09-10', '2019-09-20'],
        headers: [
            { text: '', value: 'avatar_file' },
            {
                text: '이름',
                align: 'start',
                value: 'name',
            },
            { text: '그룹', value: 'created_at' },
            { text: '장소', value: 'created_at' },
            { text: '단말기', value: 'created_at' },
            { text: '일시', value: 'created_at' },
        ],
    })
}
</script>