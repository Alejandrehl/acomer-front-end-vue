<template>
  <div>

    <section class="hero" >
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ name }} 
          </h1>
          <h2 class="subtitle">
            {{ description }}
          </h2>

          <div class="puntuation">
            <h3>Categoria: <span class="tag is-warning">Restobar</span></h3>
            <h3>Puntuación: ⭐⭐⭐⭐⭐</h3>
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="menus">
        <div v-for="sucursal in branches" v-bind:key="sucursal.id" class="menu">
          <img :src="sucursal.img" alt="">
          <h3 @click="goToSucursal(sucursal.id)">{{ sucursal.name }}</h3>
        </div>
      </div>
    </section>
    
    <section class="container">
       <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26609.671571617677!2d-70.59582545541681!3d-33.52195271820119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d0582588c2d3%3A0xa39f82d04dd6b559!2sChifa+Express!5e0!3m2!1ses!2scl!4v1555698932477!5m2!1ses!2scl" width="100%" height="550" frameborder="0" style="border:0" allowfullscreen></iframe>
    </section>
  </div>
</template>

<script>
import acomerServices from '~/components/services/acomer-services'

export default {
  data(){
    return {
      // id: this.$route.params.id,
      id: 1,
      name: '',
      category: '',
      description: '',
      branches: []
    }
  },
  methods:{
    goToSucursal(id) {
      this.$router.push(  { name: 'sucursales-id', params: {id} } )
    }
  },
  created() {
    self = this
    acomerServices.get(`/restaurants/${self.id}.json`)
      .then((response) => {
        let restaurant = response.data
        self.name = restaurant.name
        self.description = restaurant.description
        self.branches = restaurant.branches
      })
      .catch((err) => {
      });
  }
}
</script>

<style lang="scss" scoped>
  section {
    margin-bottom: 40px;
    display: flex;
    @media (max-width: 768px) {
      padding: 0 20px;
    }
  }
  .menus{
    width: 100%;
    .menu{
      width: 48%;
      height: auto;
      float: left;
      overflow: hidden;
      position: relative;
      margin: 5px 1%;
        @media (max-width: 768px) {
          width: 100%;
          margin: 5px 0;
        }
      img{
        width: 100%;
        position: absolute;    
        z-index: 1;
      }
      h3{
        height: 100%;
        z-index: 2;
        padding: 33px 11px;
        font-size: 23px;
        background: rgba(0, 0, 0, 0.5);
        width: 100%;
        text-align: center;
        color: white;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        @media(max-width: 450px){
          font-size: 18.5px;
        }
      }
    }
  }
</style>
