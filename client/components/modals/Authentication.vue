<template>
  <Modal class="modal_standard" :show="showModal" @close-modal="closeModal('authentication')">
    <div class="columns form">
      <div class="column is-half is-offset-one-quarter">
        <div class="authentication">
          <header >
            <h1>{{ this.type === 'LOGIN' ? 'Inicio de Sesión' : 'Registra tu cuenta' }}</h1> 
          </header>
          <Alerts />
          <Login v-show="this.type === 'LOGIN'"/>
          <Register v-show="this.type === 'REGISTER'"/>

          <div class="field has-text-centered" style="margin-top: 10px;">
            <FacebookButton />
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
  </Modal>
</template>
<script>
import Login from '~/components/auth/Login'
import Register from '~/components/auth/Register'
import Alerts from '~/components/alerts/Alerts'
import { mapState } from 'vuex'
import Modal from '~/components/modals/Modal.vue'
import FacebookButton from '../facebook/FacebookButton'

export default {
    props: ['showModal'],
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
      closeModal: function(modal_name){
        this.$store.dispatch('toggle_modal_state', {
          name: modal_name,
          value: false
        })
      },
    },
    components: {
      Login,
      Register,
      Alerts,
      Modal,
      FacebookButton
    }
}
</script>

<style lang="scss" scoped>
  .authentication{
    button{
      width: 75%;
      float: left;
      margin: 0px 12.5% 0;
      font-size: 14px!important;
    }
  }
  header{
    p{
      width: 100%;
      float: left;
      display: block;
      text-align: center;
    }
  }
  .form{
  
    .card-content{

      .field{
        label, input{
          font-size: 13.5px!important;
        }
        button{
          display: inline-block;
        }
      }
      
    }
  }
  .card-footer{
    width: 100%;
    float:left;
  }
</style>
