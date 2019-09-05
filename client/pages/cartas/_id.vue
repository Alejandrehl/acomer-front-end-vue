<template>
  <div class="carta-digital">
    <div
      class="banner-carta"
      v-if="!menu.img_url"
      :style="{backgroundImage: 'url('+'https://www.norden.org/sites/default/files/styles/content_image/public/images/Ny%2520nordisk%2520mad633156.jpeg?itok=DxuIYeby'+')' }"
    >
      <h1 class="title is-6 has-text-centered">{{ menu.name }}</h1>
    </div>
    <div
      class="banner-carta"
      v-if="menu.img_url"
      :style="{backgroundImage: 'url('+menu.img_url+')' }"
    >
      <h1 class="title is-6 has-text-centered">{{ menu.name }}</h1>
    </div>

    <div class="categories">
      <h2 class="description-category">{{ menu.description }}</h2>
      <h3 class="carta_section_title">Categorías</h3>
      <div v-for="category in categories" :key="category.id" class="category">
        <nuxt-link
          :to="{name: 'categorias-id', params: { id:category.id }, query: { menu_id: menu.id}}"
          :style="{backgroundImage: 'url('+category.img_url+')'}"
        >
          <!-- <img v-else src="~/assets/img/miss.png" alt="Placeholder image"/> -->
          <h2 class="title is-4">{{ category.name }}</h2>
        </nuxt-link>
        <!-- <Carousel 

        :perPageCustom="[[320, 1.4], [426,1.7], [768,3], [1024,4]]" 
        :scrollPerPage="true"
        :center="true"
        :paginationPadding="5"
        :paginationColor="'#cacaca'"
        :paginationActiveColor="'#FBE700'"
        >
        <Slide class="slide" v-for="product in category.products" v-bind:key="product.id" >
          <Product v-bind:product="product" :menu_id="menu.id"/>
        </Slide>
        </Carousel>-->
      </div>
    </div>
  </div>
</template>

<script>
// import AcNavegation from './shared/MenuNavegation.vue'
import AcCart from "~/components/Cart.vue";
import api from "~/components/services/acomer-services";
import { mapActions } from "vuex";
import { Carousel, Slide } from "vue-carousel";
import Product from "~/components/Product.vue";

export default {
  components: {
    AcCart,
    Carousel,
    Slide,
    Product
  },
  data() {
    return {
      id: this.$route.params.id,
      menu: {},
      categories: {},
      options: {
        closeText: "x",
        preloading: true
      }
    };
  },
  methods: {
    ...mapActions(["handleSetBranchData"])
  },
  created: function() {
    const self = this;
    api.get(`api/menus/${self.id}`).then(function(response) {
      self.menu = response.data.menu;
      self.categories = response.data.menu.categories;

      self.categories.forEach(cat => {
        cat.products = cat.products.filter(product => {
          return product.activated == true;
        });
      });
      self.handleSetBranchData(response.data.menu.branch);
    });
  }
};
</script>

<style lang="scss" scoped>
.category {
  position: relative;
  float: left;
  border-radius: 5px;
  width: calc(93% / 4);
  margin: 5px;
  @media screen and(max-width:650px) {
    width: calc(93% / 3);
  }
  @media screen and(max-width:482px) {
    width: calc(94% / 2);
  }
  @media screen and(max-width:400px) {
    width: 100%;
  }

  a {
    float: left;
    width: 100%;
    background-size: cover;
    border-radius: 5px;
  }
  h2 {
    position: relative;
    border-radius: 5px;
    z-index: 1;
    background-size: 100%;
    text-align: center;
    float: none !important;
    background: rgba(0, 0, 0, 0.51);
    color: #fff;
    padding: 40px 0;
    font-size: 16px;
    display: block;
  }
}
.VueCarousel-dot-container {
  background: red;
}
.categories {
  background: #f3f3f3 !important;
  padding: 15px;
  h2 {
    width: 100%;
    float: left;
  }
  .description-category {
    margin: 20px 0;
    max-height: 100px;
    overflow: hidden;
    // overflow-y: scroll;
  }
}
.banner-carta {
  height: 200px;
  float: left;
  width: 100%;
  margin-bottom: 15px;
  margin-top: 40px;
  overflow: hidden;
  z-index: 1;
  background-size: cover;
  background-repeat: no-repeat;
  @media screen and(max-width: 600px) {
    height: 150px !important;
    margin-top: 0;
  }
  h1 {
    width: 100%;
    font-size: 20px;
    position: relative;
    padding: 89px 0;
    color: #fff;
    background: rgba(0, 0, 0, 0.33);
    z-index: 3;
    @media screen and(max-width: 600px) {
      padding: 63px 0;
    }
  }

  // img{
  //   display: block;
  //   height: 200px;
  //   width: 100%;
  //   object-fit: cover;
  //   position: absolute;
  //   overflow: hidden;
  //   max-width: 100%;
  //   top: 0;
  //   z-index: 1;
  // }
}
</style>
