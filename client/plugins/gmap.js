import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCoEz-WUnQHnqUMjot5oHvnT9LmvRG_95w',
    libraries: 'places', // This is required if you use the Autocomplete plugin
  },

})