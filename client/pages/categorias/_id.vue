<template>
  <div class="carta-digital" v-if="category">
    <div
      class="banner-carta"
      v-if="!category.img_url"
      :style="{backgroundImage: 'url('+'https://www.norden.org/sites/default/files/styles/content_image/public/images/Ny%2520nordisk%2520mad633156.jpeg?itok=DxuIYeby'+')' }"
    >
      <h1 class="title is-6 has-text-centered">{{ category.name }}</h1>
    </div>
    <div
      class="banner-carta"
      v-if="category.img_url"
      :style="{backgroundImage: 'url('+category.img_url+')' }"
    >
      <h1 class="title is-6 has-text-centered">{{ category.name }}</h1>
    </div>
      <h3 class="carta_section_title">Productos</h3>
    <div class="categories">
      <div class="item-product" v-for="product in category.products" v-bind:key="product.id">
        <Product v-bind:product="product" :menu_id="menu_id" />
      </div>
    </div>
  </div>
</template>

<script>
// import AcNavegation from './shared/MenuNavegation.vue'
import AcCart from "~/components/Cart.vue";
import api from "~/components/services/acomer-services";
import { mapActions } from "vuex";
import Product from "~/components/Product.vue";

export default {
  components: {
    AcCart,
    Product
  },
  data() {
    return {
      id: this.$route.params.id,
      category: {},
      products: [],
      menu_id: this.$route.query.menu_id
    };
  },
  methods: {
    ...mapActions(["handleSetBranchData"])
  },
  created: function() {
    const self = this;
    api
      .get(`api/categories/${this.$route.params.id}`)

      .then(function(response) {
        self.category = response.data.category;

        api
          .get(`api/menus/${self.$route.query.menu_id}`)
          .then(function(response) {
            self.handleSetBranchData(response.data.menu.branch);
          });

        // Set branch data
      });
  }
};
</script>

<style lang="scss" scoped>
.carta_section_title{
  margin: 30px;
}
.category {
  position: relative;
}
.VueCarousel-dot-container {
  background: red;
}
.categories {
  background: #f3f3f3 !important;
  width: 100%;
  float: left;
  padding: 10px;
  .item-product{
    width: calc(100% / 5);
    float: left;
    @media screen and(max-width:1024px){
      width: calc(100% /4);
    }
    @media screen and(max-width:900px){
      width: calc(100% /3);
    }
    @media screen and(max-width:700px){
      width: calc(98% /2);
    }
  }
}

.banner-carta{
        height: 200px;
        float: left;
        width: 100%;
        margin-bottom: 15px;
        margin-top: 40px;
        overflow: hidden;
        z-index: 1;
        background-size: cover;
        background-repeat: no-repeat;
      @media screen and(max-width: 600px){
        height: 150px !important;
        margin-top: 0;
      }
      h1{
        width: 100%;
        font-size: 20px;
        position: relative;
        padding: 89px 0;
        color: #fff;
        background: rgba(0, 0, 0, 0.33);
        z-index: 3;
        @media screen and(max-width: 600px){
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
