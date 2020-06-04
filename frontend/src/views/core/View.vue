<template>
  <v-content>
    <router-view />

    <footer/>
  </v-content>
</template>

<script>
  export default {
    name: 'View',

    components: {
      //Footer: () => import('./Footer'),
    },
  }
</script>
