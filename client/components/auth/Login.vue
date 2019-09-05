<template>
    <div>
        <div class="field">
            <label class="label">Email</label>
            <div class="control">
                <input 
                v-model="email" 
                class="input" 
                type="text" 
                placeholder="Ingresa tu email"
                required>
            </div>
        </div>
        <div class="field">
            <label class="label">Contraseña</label>
            <div class="control">
                <input v-model="password" class="input" type="password" placeholder="*******" required>
            </div>
        </div>
        <div class="field has-text-centered">
            <button 
                class="button is-primary"
                @click.prevent="submit">
                Ingresar
            </button>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        ...mapActions(['login']),
        submit() {
            if (this.email === '' || this.password == '') {
                this.$toast.show(
                    'Debes completar todos los campos.', {
                    type: 'warning',
                    duration: 1500
                    }
                )
            } else {
                this.login({ email: this.email, password: this.password })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    button{
        display: inline-block;
    }
</style>
