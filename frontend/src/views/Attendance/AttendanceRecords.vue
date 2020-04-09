<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-row justify="center">
                    <v-col cols="10">
                        <v-card-title>
                        <v-text-field
                            v-model="search"
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                        ></v-text-field>
                        </v-card-title>
                        <v-btn color="primary">Export</v-btn>
                        <v-btn color="primary">Reset</v-btn>
                        <v-data-table
                            :headers="headers"
                            :items="desserts"
                            :items-per-page="5"
                            :search = "search"
                            class="elevation-0"
                        ></v-data-table>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data: () => ({
        search : null,
    }),
}
</script>