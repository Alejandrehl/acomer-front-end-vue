<template>
  <div>
    <!-- <template > -->
    <template v-if="branch.image_paths">
      <section class="hero" :style="{backgroundImage:'url('+branch.image_paths[0].url+')'}">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              {{ branch.name }}
              <span class="tag is-success" v-if="open">Abierto</span>
              <span class="tag is-danger" v-if="!open">Cerrado</span>
            </h1>
            <h2 class="subtitle">{{ branch.information }}</h2>
            <div class="puntuation">
              <h3>
                Categoria:
                <span class="tag is-warning">{{ branch.branch_category }}</span>
              </h3>
              <h3>
                Puntuación:
                <font-awesome-icon :icon="['fas', 'star']" />
                <font-awesome-icon :icon="['fas', 'star']" />
                <font-awesome-icon :icon="['fas', 'star']" />
                <font-awesome-icon :icon="['fas', 'star']" />
                <font-awesome-icon :icon="['fas', 'star']" />
              </h3>
            </div>
          </div>
        </div>
      </section>
    </template>

    <section class="hero" v-else>
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ branch.name }}
            <span class="tag is-success" v-if="open">Abierto</span>
            <span class="tag is-danger" v-if="!open">Cerrado</span>
          </h1>

          <h2 class="subtitle">{{ branch.information }}</h2>

          <div class="puntuation">
            <h3>
              Categoria:
              <span class="tag is-warning">{{ branch.branch_category }}</span>
            </h3>
            <h3>
              Puntuación:
              <font-awesome-icon :icon="['fas', 'star']" />
              <font-awesome-icon :icon="['fas', 'star']" />
              <font-awesome-icon :icon="['fas', 'star']" />
              <font-awesome-icon :icon="['fas', 'star']" />
              <font-awesome-icon :icon="['fas', 'star']" />
            </h3>
          </div>
        </div>
      </div>
    </section>

  <div class="column is-6"   v-if="image_branch_paths.length > 1">
    <section class="container">
      <!-- <Gallery :images="branch.images" class="gallery"/> -->
      <Lightbox
        class="lb"
        :images="image_branch_paths"
        :image_class="'item-lb'"
        :album_class="'album-lb'"
        :options="options"
        ></Lightbox>
    </section>

    <section class="container">
      <div class="hours" >
        <h2 class="subtitle">Horario</h2>
        <div v-for="day in branch.schedules" v-bind:key="day" class="day">
          <p>{{day.day}}</p>
          <p>{{day.opening.substring(0,5)}}</p>
          <p>{{day.closing.substring(0,5)}}</p>
        </div>
      </div>
    </section>
  </div>
  <div class="column is-6">
    <section class="container">
      <div class="menus">
        <h2 class="subtitle">Menus</h2>
        <div v-for="menu in menus" v-bind:key="menu.id" class="menu">
          <img :src="menu.img_url" alt />
          <h3 @click="goToMenu(menu.id)">{{ menu.name }}</h3>
        </div>
      </div>
    </section>

    <section class="container map-section">
      <div class="map">
        <h2 class="subtitle">¿Como llegar?</h2>
        <p>Dirección: {{branch.street}}</p>

        <gmap-map :center="ubication" :zoom="16" style="width:100%;  height: 400px;">
          <gmap-marker :center="ubication" :position="ubication" :title="'asd'"></gmap-marker>
        </gmap-map>
      </div>
    </section>
    </div>
  </div>
</template>


<script>
import acomerServices from "~/components/services/acomer-services";
import Gallery from "~/components/Gallery";
import mapsService from "~/components/services/maps-services";
import Lightbox from "vue-simple-lightbox";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      id: this.$route.params.id,
      branch: {},
      menus: {},
      center: { lat: -33.5152852, lng: -70.6150583 },
      ubication: {},
      options: {
        closeText: "x",
        preloading: true
      },
      image_branch_paths: []
    };
  },
  computed: {
    open: function() {
      return true;
    }
  },
  components: {
    Gallery,
    Lightbox
  },
  methods: {
    ...mapActions(["handleSetBranchData"]),
    goToMenu(id) {
      this.$router.push({ name: "cartas-id", params: { id } });
    }
  },
  created() {
    self = this;
    acomerServices.get(`api/branches/${self.id}`).then(function(response) {
      self.branch = response.data.branch;
      self.handleSetBranchData(response.data.branch);
      self.menus = response.data.menus;

      response.data.branch.image_paths.forEach(function(imagen) {
        self.image_branch_paths.push({ src: imagen.url, thumb: imagen.url });
      });

      mapsService
        .get(
          "place/textsearch/json?query=" +
            response.data.branch.street +
            "&location=-33.5346427,-70.6307518&radius=100&key=AIzaSyCoEz-WUnQHnqUMjot5oHvnT9LmvRG_95w"
        )
        .then(response => {
          self.searchResult = response.data.results;
          self.ubication = response.data.results[0].geometry.location;
        })
        .catch(err => {
          console.error("Error: " + err);
        });
    });
  }
};
</script>

<style lang="scss" scoped>
.close{
 display: none;
}
.show{
  display: block;
}
.column{
  float: left;
}
.hero {
  background-size: cover;
}
.hero-body {
  background: rgba(0, 0, 0, 0.71);
  @media (max-width: 426px) {
    padding: 50px 10% 50px;
    // padding:  0;
    .title {
      font-size: 26px;
      margin-bottom: 30px;
    }
    .subtitle {
      font-size: 16px;
      line-height: 1.4em;
    }
  }
}

.container {
    width: 100%;
    padding: 1%;
    float: left;
    margin: 5px;
}
.hero {
  color: #ffffff;
  @media screen and(max-width:426px) {
    padding: 0;
  }
  h1 {
    color: #ffffff;
  }
  h2 {
    color: #ffffff;
  }
}
.banner-sucursal {
  display: none;
  @media screen and(max-width:426px) {
    display: block;
    width: 100%;
    height: 54%;
    object-fit: cover;
    position: absolute;
    top: 0;
    z-index: -1;
  }
}
section {
  margin-bottom: 40px;
  display: flex;
  @media (max-width: 768px) {
    padding: 0 20px;
  }
}
.gallery {
  width: 100%;
}
#gallery {
  img {
    margin: 0 auto;
  }
}
.hours,
.menus,
.main_pic {
  float: left;
  width: 100%;
  background: #ffffff;
  padding: 10px;
  border-radius: 15px;
  h2 {
    font-weight: bold;
  }

  p {
    width: 35%;
    float: left;
  }
  .day {
    width: 50%;
    // float: left;
    display: block;
    @media (max-width: 768px) {
      width: 100%;
    }
    p {
      width: 31%;
      float: left;
      margin: 5px 1%;
    }
  }
}
.menus {
  width: 100%;
  .menu {
    border-radius: 5px;
    width: calc(94%/2);
    height: auto;
    float: left;
    overflow: hidden;
    position: relative;
    margin: 5px 1%;
    @media (max-width: 768px) {
      width: calc(95%/2);
      margin: 5px;
    }
    @media screen and(max-width:550px){
      width: 100%;
    }
    img {
      width: 100%;
      position: absolute;
      z-index: 1;
    }
    h3 {
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
      font-weight: 600;
      @media (max-width: 450px) {
        font-size: 18.75px;
      }
    }
  }
}
.puntuation {
  h3 {
    float: left;
    margin-left: 25px;
    @media (max-width: 768px) {
      margin-left: 0px;
      width: 100%;
      margin-bottom: 3px;
    }
  }
  svg {
    color: #fbe700;
  }
}
.map-section {
  display: block;
  .map {
    float: left;
    width: 100%;
    background: #ffffff;
    padding: 10px;
    border-radius: 15px;
    h2 {
      font-weight: bold;
    }
  }
  h2,
  p {
    width: 100%;
    float: left;
  }
}
.vue-map-container {
  float: left;
  margin-top: 15px;
}
</style>
