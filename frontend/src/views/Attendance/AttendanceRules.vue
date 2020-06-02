<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-btn class="ml-5 mt-3" color="primary"><v-icon dark left>mdi-plus</v-icon>추가</v-btn>
                <v-btn class="ml-5 mt-3" color="primary"><v-icon dark left>settings</v-icon>업데이트</v-btn>
                <v-btn class="ml-5 mt-3" color="error"><v-icon dark left>delete_forever</v-icon>삭제</v-btn>
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
     data: () => ({
        headers: [
            {
                text: '이름',
                align: 'start',
                value: 'name',
            },
            { text: '총합', value: 'created_at' },
            { text: '규칙', value: 'created_at' },
        ],
     })
}
</script>