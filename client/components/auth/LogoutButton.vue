<template>
    <button @click="logout"
        class="button is-danger">
        Desconectar
    </button>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    methods: {
        ...mapActions(['logout'])
    }
}
</script>

