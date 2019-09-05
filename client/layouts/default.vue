<template>
  <div>
    <AcCart/>
    <AcNavBar/>
    <nuxt />
  </div>
</template>

<script>
  import AcCart from '~/components/Cart.vue'
  import AcNavBar from '~/components/NavBar.vue'
  import setAuthToken from '../utils/setAuthToken'
  import { mapState, mapActions } from 'vuex'
  import LogoutButton from '../components/auth/LogoutButton'
  import { qvoService, qvoApi } from '~/components/services/qvo-services.js'
  
  export default {
    computed: {
      ...mapState(['isAuthenticated', 'user', 'branchData', 'fbToken'])
    },
    methods: {
      ...mapActions(['loadUser', 'loadFbUser', 'register', 'login'])
    },
    created(){
      if (this.$auth.user) {
        this.login({
          email: this.$auth.user.email,
          password: this.$auth.user.id,
          type: 'FACEBOOK_AUTH'
        })
      }
      this.loadUser()
    },
    components: { 
      AcCart, 
      AcNavBar,
      LogoutButton
    }
  }
</script>


<style lang="scss">
  @import '../node_modules/bulma/bulma.sass';
  *{
    font-family: 'Montserrat', sans-serif;
  }
  html{
    // float: left;
    padding-bottom: 90px;
  }

  html{
    background-color: #f3f3f3;
  }
  .ac-mobile-container{
    padding: 0 10px;
    .image {
      img{
        height: 130px;
        object-fit: cover;
      }
    }
  }
  .acomer-button{
    background: #FBE700;
    border-radius: 3px;
    font-weight: bold !important;
    padding-top: 5px;
    padding-bottom: 5px;
    border: none;
    font-weight: 500; 
    color: #545454;
    cursor: pointer;
    -webkit-transition: all 300ms ease-in-out;
    -moz-transition: all 300ms ease-in-out;
    -ms-transition: all 300ms ease-in-out;
    -o-transition: all 300ms ease-in-out;
    transition: all 300ms ease-in-out;
    &:hover{
      background: white;
      color: #545454;
      border: 1px solid #fbe700;
    }
  }
  
  .reservationModalContainer{
    position: fixed;
    top: 0%!important;
    background: rgba(35, 35, 35, 0.61);
    height: 100vh;
  }
  .reservationModal{
    padding-top:28px!important;
    padding-bottom:28px!important;
    font-size: 17px!important;
    background: #FBE700!important;
    color: black!important;
    .action{
      text-align: center;
      border: 1px solid #505050;
      cursor: pointer;
    }
  }

  .reservation_result{
    text-align: center;
    .field{
      width: 48%;
      text-align: left;
      margin: 5px 1%;
      float: left;
    }
  }

  // Lightbox
  .pedido_dentro_local_modal{
    select{
      width: 100%;
      padding: 4px 10px;
      margin: 0 0 10px;
    }
    button{
      margin-top: 15px;
    }
  }
  // Loader
  .loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
