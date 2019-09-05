<template>
  <div id="product" class="page" v-if="product.activated">
    <div class="card">
      <div class="card-image">
        <figure class="image">
          <img
            v-if="product.image_product_paths.length"
            :src="product.image_product_paths[0].url"
            :alt="product.name"
            @click="goToProduct(product.id)"
          />
          <img
            v-else
            src="~/assets/img/miss.png"
            alt="Placeholder image"
            @click="goToProduct(product.id)"
          />
        </figure>
      </div>
      <div class="card-content">
        <div class="is-mobile">
          <div class="media-content">
            <p class="title" @click="goToProduct(product.id)">{{ product.name }}</p>
            <p class="subtitle is-6">{{product.ingredient}}</p>
            <div class="puntuacion">
              <p>
                <font-awesome-icon :icon="['fas', 'dollar-sign']" />
                {{ product.price | numFormat }}
              </p>
              <p>
                <font-awesome-icon :icon="['fas', 'star']" />4.9
              </p>
              <!-- <p><font-awesome-icon :icon="['fas', 'clock']" /> 20 min</p> -->
            </div>
          </div>

          <div class="botones">
            <button
              class="button is-primary-ac acomer-button"
              @click="goToProduct(product.id)"
            >Ver más</button>
            <button
              class="button is-primary-ac acomer-button"
              @click="handleAddProduct({product, menu_id, quantity: 1})"
            >Agregar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "product",
  props: ["product", "menu_id"],
  data() {
    return {
      menu: true
    };
  },
  methods: {
    goToProduct(id) {
      // Navega de una ruta a otra
      this.$router.push({
        name: "productos-id",
        params: { id },
        query: { menu_id: this.menu_id }
      });
    },
    ...mapActions(["handleAddProduct"])
  },
  filters: {
    numFormat: function(value) {
      return value.toLocaleString();
    }
  }
};
</script>

<style lang="scss"  scoped>
.page {
  float: left;
  width: 100%;
  margin: 10px 1%;
}
.card {
  width: 95%;
  position: relative;
  height: auto;
  margin: 0 auto;
  overflow: hidden;
  @media (max-width: 768px) {
    img {
      border-radius: none !important;
      object-fit: cover;
    }
  }
  @media (max-width: 480px) {
    height: auto;
    border-radius: 5px;
    img {
      object-fit: cover;
      height: inherit !important;
      width: 100% !important;
    }
  }

  height: 300px;
  border-radius: 5px;
  img {
    height: inherit !important;
    width: 100% !important;
    object-fit: cover;
  }
}

.card-image {
  height: 100%;
  @media (max-width: 480px) {
    height: 120px;
  }
  @media (max-width: 400px) {
    height: 100px;
  }
}
figure {
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
  @media (max-width: 480px) {
    border-radius: 0px;
  }
  img {
    margin: 0;
    height: 100%;
    width: inherit;
    max-width: inherit !important;
    overflow: hidden;
    border-radius: 15px;
    @media (max-width: 480px) {
      border-radius: 0px;
    }
  }
}

.card-content {
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 0;
  background: white;
  width: 90%;
  margin: 0 5% 10px;
  padding: 10px;
  height: auto;
  float: left;
  border-radius: 15px;
  @media (max-width: 480px) {
    width: 100%;
    margin: 0 0 10px;
  }
  @media (max-width: 480px) {
    position: relative;

    margin: 0 0 0px;
  }

  .media-content {
    overflow-x: inherit;
    p {
      // white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 14px;
    }
    p.title {
      font-weight: 600;
      font-size: 17px;
      line-height: 1.4;
      height: 17px * 1.4 * 2;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      // display: -webkit-box;
      text-align: center !important;
      -webkit-box-orient: vertical;
      @media (max-width: 480px) {
        font-size: 14.5px;
        height: 14.5px * 1.4 * 2;
        -webkit-box-orient: vertical;
      }
      @media (max-width: 350px) {
        height: 13px * 1.4 * 2 !important;
        font-size: 13px;
        -webkit-box-orient: vertical;
      }
    }
    p.subtitle {
      color: #909090;
      margin-bottom: 5px;
      height: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      @media (max-width: 350px) {
        font-size: 11.5px;
      }
    }
    .puntuacion {
      float: left;
      width: 100%;
      p {
        float: left;
        width: 48%;
        text-align: center;
        margin-right: 2%;
        text-align: left;
        font-size: 13.75px;
        font-weight: 600;
        color: #848484;
        @media (max-width: 480px) {
          font-size: 12.5px;
        }
        @media (max-width: 350px) {
          font-size: 11.5px;
        }
      }
      svg {
        color: #fbe700;
      }
    }
  }
}

#product {
  margin-bottom: 25px;
}
.botones {
  text-align: center;
  float: left;
  width: 100%;
  button {
    font-size: 14px;
    width: 47%;
    float: left;
    &:nth-child(even) {
      margin: 6px 0 0px 3%;
    }
    &:nth-child(odd) {
      margin: 6px 3% 0px 0;
    }
    @media (max-width: 480px) {
      font-size: 12px;
      margin: 7.5px auto 0px;
      padding: 2px 10px;
    }
    @media (max-width: 350px) {
      font-size: 10px;
      margin: 6.5px auto 0px;
      padding: 1.5px 10px;
    }
  }
}
</style>
