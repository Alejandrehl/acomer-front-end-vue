<template>
  <section v-if="modalComentary">
    <form v-on:submit.prevent="sendComentary">
      <h2 @click="closeModal"><font-awesome-icon :icon="['fas', 'times']" /></h2>
      <h1 class="subtitle">¡Cuentanos cuanto te gusto este plato!</h1>
      <VueStars
      name="stars"
      v-model="stars"
      :max="5"
      :value="3"
      :class="stars-review"
      />
    
      <input type="text" v-model="comentary" name="" id="" placeholder="Comentario">
      <button class="button acomer-button">
        Enviar comentario <font-awesome-icon :icon="['fas', 'comment-dots']" />
      </button>
    </form>
  </section>
</template>

<script>
import adminApi from '~/components/services/acomer-admin-services'
import { mapState } from 'vuex'
import {VueStars} from "vue-stars"

export default {
  props: ['modalComentary','commentData'],
  data(){
    return{
      stars: 5,
      comentary: ''
    }
  },
  components:{
    VueStars
  },
  methods: {
    sendComentary: function () {
      const self = this
      
      adminApi.post('/reviews.json', {
        review: {
          stars: self.stars,
          commentary: self.comentary,
          user_id: parseInt(this.user.id),
          product_id: self.commentData.product_id
        }
      }) 
        .then((response) => {
          this.$toast.show( 
            '¡Gracias por tu comentario! 😉',
              { type: 'success',
                duration: 600  }
            )
          self.modalComentary = false
        })
        .catch(e => {
        })
    },
    closeModal: function () {
      if( self.modalComentary === false ){
        self.modalComentary = true
      } else {
        self.modalComentary = false
      }
    }
  },
  computed: {
    ...mapState(['user']),
    
    // stars_rate: function() {
    //   if(this.stars == 5){
    //     return 'Excelente'
    //   } else if(this.star == 4){
    //     return 'Muy bueno'
    //   } else if(this.star == 3){
    //     return 'Muy bueno'
    //   } else if(this.star == 2){
    //     return 'Normal'
    //   } else if(this.star == 1){
    //     return 'Muy bueno'
    //   }

    // }

  }
}
</script>


<style lang="scss" scoped>
  section{
    width: 100%;
    background: rgba(0, 0, 0, 0.35);
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 10;
  }
  form{
    border-radius: 7.5px;
    h1{
      margin-bottom: 10px;
    }
    h2{
      text-align: right;
      cursor: pointer;
      width: 100%;
    }
    width: 90%;
    background: white;
    margin: 45px 5%;
    position: absolute;
    padding: 15px;
    text-align: center;
    input{
      width: 100%;
      margin-bottom: 10px;
      float: left;
      border-radius: 5px;
      height: 30px;
      padding: 10px;
      border: 1px solid #a9a9a9;
    }
    button{
      margin-top: 15px;
      font-size: 14px;
    }
  }

  .vue-stars{
    width: auto;
    font-size: 35px;
    text-align: center;
    margin: 0px auto 8px;
    --shadow-color:none !important;

    &::shadow{
      text-shadow: none;
    }
  }
</style>