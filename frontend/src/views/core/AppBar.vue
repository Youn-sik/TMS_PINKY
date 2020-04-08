<template>
    <v-app id="inspire">
        <v-app-bar
        app
        clipped-right
        color="blue"
        dark
        >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title></v-toolbar-title>
        <v-spacer />
        </v-app-bar>
</template>
<script>
    export default {
        name: 'Appbar',
    }
</script>