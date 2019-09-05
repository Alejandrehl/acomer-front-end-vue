<template>
    <div>
        <div class="field">
            <label class="label">Nombre</label>
            <div class="control">
                <input v-model="name" class="input" type="text" placeholder="Ingresa tu nombre" required>
            </div>
        </div>
        <div class="field">
            <label class="label">Email</label>
            <div class="control">
                <input v-model="email" class="input" type="email" placeholder="Pepe@gmail.com" required>
            </div>
        </div>
        <div class="field">
            <label class="label">Contraseña</label>
            <div class="control">
                <input v-model="password" class="input" type="password" placeholder="***********" required minlength="6">
            </div>
        </div>
        <div class="field">
            <label class="label">Confirmar Contraseña</label>
            <div class="control">
                <input v-model="password_confirmation" class="input" type="password" placeholder="***********" required>
            </div>
        </div>
        <div class="field has-text-centered">
            <button 
                class="button is-primary"
                @click="submitForm">
                Registrar
            </button>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    data: function () {
        return {
            name: '',
            email: '',
            password: '',
            password_confirmation: ''
        }
    },
    methods: {
        ...mapActions(['setAlert', 'register']),
        submitForm() {
            if (this.name === '' || this.email === '' || this.password === '') {
                this.$toast.show(
                    'Debes completar todos los campos.', {
                    type: 'warning',
                    duration: 1500
                    }
                )
            } else if (this.password !== this.password_confirmation) {
                this.$toast.show(
                    'Las contraseñas deben ser iguales..', {
                    type: 'warning',
                    duration: 1500
                    }
                )
            } else if (this.password.length < 6) {
                this.$toast.show(
                    'Mínimo 6 caracteres para la contraseña.', {
                    type: 'warning',
                    duration: 1500
                    }
                )
            } else {
                this.register({
                    name: this.name,
                    last_name: this.last_name,
                    email: this.email,
                    password: this.password
                })
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
