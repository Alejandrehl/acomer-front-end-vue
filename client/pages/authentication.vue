<template>
    <div id="Login" class="container" style="padding: 30px;">
        <div class="columns">
            <div class="column is-half is-offset-one-quarter">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            {{ this.type === 'LOGIN' ? 'Inicio de Sesión' : 'Registra tu cuenta' }}
                        </p> {{ isAuthenticated ? '¡Sesión iniciada correctamente!' : '¡Inica sesión!' }}
                        <a href="#" class="card-header-icon" aria-label="more options">
                        <span class="icon">
                            <i class="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                        </a>
                    </header>
                    <div class="card-content">
                        <Alerts />
                        <Login v-show="this.type === 'LOGIN'"/>
                        <Register v-show="this.type === 'REGISTER'"/>
                    </div>
                    <footer class="card-footer">
                        <a @click="goToLogin" class="card-footer-item">
                            Ingresar
                        </a>
                        <a @click="goToRegister" class="card-footer-item">
                            Registrar
                        </a>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Login from '~/components/auth/Login.vue'
import Register from '~/components/auth/Register.vue'
import Alerts from '~/components/alerts/Alerts.vue'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            type: 'LOGIN',
        }
    },
    computed: {
        ...mapState(['isAuthenticated'])
    },
    methods: {
        goToRegister() {
            this.type = 'REGISTER'
        },
        goToLogin() {
            this.type = 'LOGIN'
        },
        },
    beforeUpdate() {
        if (this.isAuthenticated) {
            this.$router.push('/')
        }
    },
    components: {
        Login,
        Register,
        Alerts
    }
}
</script>