<template>
  <div>
    <AcSearcher/> 
    <div class="columns">
      <div class="column">
        <h3>Busqueda: {{this.$route.query.q}}</h3>
        <section class="card">
          <div class="hero-body" v-if="local">
            <h1 class="title">
              {{local.name}} 
              <!-- <span class="tag is-success" v-if="open">Abierto</span>
              <span class="tag is-danger" v-if="!open">Cerrado</span> -->
            </h1>
            <h2 class="subtitle">
              {{local.address}}
            </h2>
            <div class="puntuation">
              <!-- <h3>Categoria: <span class="tag is-warning">{{ branch.category }}</span></h3> -->
              <h3>Puntuación:  {{ local.rating }} ({{local.rating_total}})</h3>
            </div>
          </div>
        </section>
      </div>
      <div class="column">
        <gmap-map
          :center="center"
          :zoom="12"
          style="width:100%;height: 400px;"
          v-if="searchResult.length > 0"
        >
          <gmap-marker
            :position="center"
            @click="inicial"
          ></gmap-marker>

          <gmap-marker
            v-for="m in searchResult"
            :key="m.id"
            :position="m.geometry.location"
            @click="showLocalInfo(m)"
          ></gmap-marker>

        </gmap-map>
      </div>
    </div>
  </div>
</template>


<script>
  import AcSearcher from '~/components/Searcher.vue'
  import trae from 'trae'
  import mapsService from '~/components/services/maps-services'
 import { mapState, mapActions } from 'vuex'

  export default {
    data() {
      return {
        searchResult: [],
        places: [],
        currentPlace: null,
        local: '',
      }
    },
    components:{ 
      AcSearcher 
    },
    computed: {
      ...mapState(['userPosition']),
      searchQuery: function() {
        return this.$route.query.q
      },
      center: function() {
        var center = {
          lat: this.userPosition.latitude, 
          lng: this.userPosition.longitude 
        }
        return  center
      },
    },
    created () {
      this.setUserPoisition()
      var self = this 
      setTimeout(function(){ 
        mapsService.get(`place/textsearch/json?query=${self.$route.query.q}&location=${self.userPosition.latitude},${self.userPosition.longitude}&radius=100&key=AIzaSyCoEz-WUnQHnqUMjot5oHvnT9LmvRG_95w`)
        .then(function (response) {
          self.searchResult = response.data.results
        })

      }, 2000);
    
    },
    watch: {
      searchQuery: function() {
        const self = this
        setTimeout(function(){ 
          mapsService.get(`place/textsearch/json?query=${self.$route.query.q}&location=${self.userPosition.latitude},${self.userPosition.longitude}&radius=100&key=AIzaSyCoEz-WUnQHnqUMjot5oHvnT9LmvRG_95w`)
          .then(function (response) {
            self.searchResult = response.data.results
          })
        }, 2000);
      }
    },
    methods: {
      ...mapActions(['handleUserPoisition']),
      // receives a place object via the autocomplete component
      setPlace(place) {
        this.currentPlace = place
      },
      addMarker() {
        if (this.currentPlace) {
          const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          }
          this.markers.push({ position: marker })
          this.places.push(this.currentPlace)
          this.center = marker
          this.currentPlace = null
        }
      },
      geolocate: function() {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        })
      },
      showLocalInfo: function (m) {
        this.local = {
          name: m.name,
          description: 'aa',
          address: m.formatted_address,
          // open: opening_hours.open_now,
          rating: m.rating,
          rating_total: m.user_ratings_total,
          categoria: m.types[0],
          foto: m.photos[0].photo_reference 
        }
        // if(m.photos.photo_reference) this.
      },
      inicial: function () {
        // alert('this')
      }
    }
  }
</script>


<style lang="scss" scoped>
  .map{
    width: 100%;
    height: 100vh;
  }
</style>
