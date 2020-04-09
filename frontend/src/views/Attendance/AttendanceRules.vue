<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-row justify="center">
                    <v-col cols="10">
                        <v-btn color="primary">Add</v-btn>
                        <v-data-table
                            :headers="headers"
                            :items="desserts"
                            :items-per-page="5"
                            class="elevation-0"
                        ></v-data-table>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>