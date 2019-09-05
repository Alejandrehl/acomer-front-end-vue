<template>
  <button @click="logout">
    Salir
  </button>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    logout() {
      this.$auth.$state.loggedIn = false
      this.$auth.$state.user = null
    }
  }
}
</script>
