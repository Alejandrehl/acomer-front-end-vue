<template>
  <div class="container page">
    <ModalComentaries
      :modalComentary="modalComentary"
      :commentData="{product_id: product.id, menu_id: menu_id}"
    />
    <div class="header">
      <div class="foto">
        <template v-if="product.image_product_paths">
          <Lightbox
            v-if="product.image_product_paths.length > 0"
            class="main_pic"
            :images="images_for_product"
            :image_class="'product_big_picture'"
            :album_class="'product_carousel'"
            :options="options"
          ></Lightbox>
        </template>
        <template v-if="product.image_product_paths == false">
          <img src="~/assets/img/miss.png"/>
        </template>
      </div>
      <div class="header_texto">
        <h1 class="title is-3">{{ product.name }}</h1>
        <h2 class="subtitle is-6">Ingredientes: {{ product.ingredient }}</h2>
        <h3 class="subtitle is-5" v-if="product.price">Valor: ${{ product.price | numFormat }}</h3>
        <div class="puntuacion">
          <p>
            4.9
            <font-awesome-icon :icon="['fas', 'star']" />
            <font-awesome-icon :icon="['fas', 'star']" />
            <font-awesome-icon :icon="['fas', 'star']" />
            <font-awesome-icon :icon="['fas', 'star']" />
            <font-awesome-icon :icon="['fas', 'star']" />
            (200)
          </p>
        </div>
        <div class="texto">
          <div class="item-texto">
            <p>{{product.description}}</p>
            <div class="agregar_a_pedido">
              <input type="number" name="cantidad" v-model="quantity" min="1" pattern="^[0-9]+" />
              <button
                class="button acomer-button"
                @click="handleAddProduct({product, menu_id, quantity})"
              >
                Agregar a carrito
                <font-awesome-icon :icon="['fas', 'shopping-cart']" />
              </button>
            </div>
          </div>
          <div class="btn-rrss">
          <h3 class="carta_section_title">¡Comparte en tus redes! </h3>
            <FacebookShare :page_url="page" title_social="Facebook" has_counter has_icon></FacebookShare>
            <WhatsappShare :page_url="page" title_social="Whatsapp" has_icon></WhatsappShare>
            <TelegramShare :page_url="page" title_social="Telegram" has_icon></TelegramShare>
            <TwitterShare :page_url="page" title_social="Twitter" has_icon></TwitterShare>
          </div>
        </div>
      </div>
    </div>
    <!-- Comentarios -->
    <h1 class="title is-5 titulo-comentario">Comentarios</h1>
    <div class="comentarios">
      <button class="button acomer-button" @click="openComentaryModal">
        Agregar comentario
        <font-awesome-icon :icon="['fas', 'comment-dots']" />
      </button>
      <AcComentary
        v-for="comentary in comentaries"
        v-bind:key="comentary.id"
        v-bind:comentary="comentary"
      />
    </div>
    <!-- Fin Comentarios -->
  </div>
</template>

<script>
import Lightbox from "vue-simple-lightbox";
import OwlCarousel from "vue-owl-carousel";
import AcComentary from "~/components/Comentary.vue";

// API Services
import api from "~/components/services/acomer-services";
import adminApi from "~/components/services/acomer-admin-services";

import ModalComentaries from "~/components/ModalComentaries.vue";
import { mapActions } from "vuex";
import FacebookShare from "vue-goodshare/src/providers/Facebook.vue";
import WhatsappShare from "vue-goodshare/src/providers/WhatsApp.vue";
import TelegramShare from "vue-goodshare/src/providers/Telegram.vue";
import TwitterShare from "vue-goodshare/src/providers/Twitter.vue";

export default {
  data() {
    return {
      product: {},
      id: this.$route.params.id,
      comment_stars: "",
      comment_commentary: "",
      modalComentary: false,
      quantity: 1,
      page: window.location.href,
      options: {
        closeText: "x",
        preloading: true
      },
      comentaries: [],
      images_for_product: []
    };
  },
  computed: {
    menu_id: function() {
      return this.$route.query.menu_id;
    }
  },
  components: {
    OwlCarousel,
    AcComentary,
    ModalComentaries,
    FacebookShare,
    WhatsappShare,
    TelegramShare,
    TwitterShare,
    Lightbox
  },
  created() {
    self = this;
    api.get(`/api/products/${self.id}`).then(function(response) {
      self.product = response.data.product;
      response.data.product.image_product_paths.forEach(function(imagen) {
        self.images_for_product.push({ src: imagen.url, thumb: imagen.url });
      });
      api.get(`api/menus/${self.$route.query.menu_id}`)
        .then(function(response) {
          self.handleSetBranchData(response.data.menu.branch);
        });
    });
    api.get(`/api/comentaries/${self.id}`).then(function(response) {
      self.comentaries = response.data;
    });
  },
  filters: {
    numFormat: function(value) {
      return value.toLocaleString();
    }
  },
  methods: {
    openComentaryModal: function() {
      if (self.modalComentary === false) {
        self.modalComentary = true;
      } else {
        self.modalComentary = false;
      }
    },
    ...mapActions(["handleAddProduct", "handleSetBranchData"])
  }
};
</script>

<style lang="scss" scoped>
.item-texto{
  width: 48%;
  float: left;
  height: auto;
  padding: 0 20px;
  @media screen and(max-width: 600px){
    width: 100%;
  }
  .agregar_a_pedido{
    width: 100%;
    float: left;
      input,button{
        width: 100%;
      float: left;
      margin: 10px 0;
    }
  }
}
.btn-rrss{
  width: 48%;
  float: left;
  padding: 0 20px;
  @media screen and(max-width: 600px){
    width: 100%;
  }
  @media screen and(max-width: 426px){
    width: 100%;
  }
  h3{
    width: 100%;
    margin-bottom: 15px;
    margin-top: 0;
  }
  a{
    width: calc(95%/2);
    float: left;
      @media screen and(max-width: 850px){
      width: 100%;
    }
  }
}
a {
  &:hover{
    z-index: none;
  }
}

.foto {
  max-height: 350px;
  overflow: hidden;
  @media (max-width: 480px) {
    max-height: 265px;
    overflow: hidden;
  }
}
.page {
  max-width: 800px;
  margin: 0 auto;
}
.titulo-comentario {
  width: 90%;
  margin: 0 5% 15px;
  float: left;
}
  .product_big_picture{
    width: 100% !important;
    object-fit: cover;
    a{
      &:hover{
        img{
          z-index: 1!important;
        }
      }
    }
  }

.header_texto {
  width: 95%;
  float: left;
  margin: 0 2.5%;
  padding: 15px 25px 0;
  position: relative;
  top: -65px;
  z-index: 3;
  background: white;
  border-radius: 15px;
  @media (max-width: 768px) {
    padding: 15px 10px 10px;
    top: -55px;
  }
  @media (max-width: 480px) {
    padding: 15px 20px 10px;
    top: -35px;
  }
  @media (max-width: 360px) {
    padding: 15px 10px 15px;
  }
  h1 {
    font-size: 23.5px;
    @media (max-width: 360px) {
      // font-size: 23.5px;
      font-size: 20.5px;
    }
  }
  .subtitle.is-6 {
    font-size: 14px;
  }
  svg {
    color: #FBE700;
  }
  button {
    svg {
      color: #545454;
    }
  }
}

.button-social {
  @media (max-width: 480px) {
    font-size: 13px;
    width: 48%;
    text-align: center;
    float: left;
    padding: 5px 10px;
    margin: 5px 1%;
  }
}
.whatsapp__design__flat {
  background-color: #00bfa5;
}
.texto {
  float: left;
  position: relative;
  top: 15px;
  padding-bottom: 25px;
  @media (max-width: 360px) {
    padding: 0px 0px 10px;
    p {
      font-size: 14px;
    }
  }
}
h1 {
  text-transform: capitalize;
}
h2 {
  color: #909090;
}
h3 {
  margin-top: 15px;
  color: #545454;
  font-weight: 600;
  margin-bottom: 15px!important;
  font-size: 20.5px;
}
p {
  color: #909090;
}
.comentarios {
  float: left;
  margin-bottom: 50px;
  .box{
    box-shadow: none;
  }
  button {
    clear: both;
    margin-left: 15px;
    margin-bottom: 15px;
  }
}

.carousel img {
  margin: 0;
  width: 100%;
  overflow: hidden;
}

.agregar_a_pedido {
  width: 100%;
  text-align: center;
  margin-top: 25px;
  padding: 0px;
  margin-bottom: 15px;
  float: left;
  @media (max-width: 480px) {
    input,
    button {
      width: 48% !important;
      margin: 0 1% !important;
      &:nth-child(1) {
        margin: 0 2% 0 0 !important;
      }
      &:nth-child(2) {
        margin: 0 0 0 2% !important;
      }
    }
  }
  input {
    width: 46%;
    margin: 0 2%;
    float: left;
    border-radius: 5px;
    height: 30px;
    padding: 10px;
    border: 1px solid #a9a9a9;
  }
  button {
    width: 46%;
    margin: 0 2%;
    float: left;
  }
}

button {
  font-size: 12.5px;
  svg {
    margin-left: 10px;
  }
}
.puntuacion {
  float: left;
  width: 100%;
  p {
    float: left;
    // width: 33.3%;
    text-align: left;
    font-size: 15.5px;
    @media (max-width: 480px) {
      font-size: 14px;
    }
  }
}
</style>
