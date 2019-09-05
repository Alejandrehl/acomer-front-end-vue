<template>
<!--   
  <OwlCarousel id="gallery" z :responsive="{0:{items:1.5,nav:false},800:{items:3}}" @updated="updated">
    <img v-for="foto in images" v-bind:key="foto" :src="'https://acomerapi.herokuapp.com'+foto.src" alt="" class="image" />
  </OwlCarousel> -->
  <div>
    <Carousel 
    :perPageCustom="[[0, 1.25], [768, 2], [1024, 2.5]]" 
    :navigationEnabled="true"
    :scrollPerPage="false"
    :paginationPadding="5"
    :paginationColor="'#cacaca'"
    :paginationActiveColor="'#FBE700'">
      <Slide v-for="foto in images" v-bind:key="foto" alt="" class="image">
        <img :src="foto.src" alt="" />
      </Slide>
    </Carousel>
  </div>
</template>
 
<script>
import Product from '~/components/Product.vue'

import { Carousel, Slide } from 'vue-carousel'
// import LightBox from 'vue-image-lightbox'
// import lightbox from 'lightbox2'

export default {
  name: 'Category',
  props: ['images'],
  components: {
    // OwlCarousel
    Carousel, Slide
  },
  data () {
    return {
      fotos: [ 
        {src: 'https://placeimg.com/200/200/any?1'},
        {src: 'https://placeimg.com/200/200/any?2'},
        {serc: 'https://placeimg.com/200/200/any?3'}
      ]
    }
  }
 
}
</script>

<style lang="scss" scoped>
  .image{
    height: 300px;
    overflow: hidden;
    display: flex;
    margin: 0 15px 0 0;
    @media (max-width: 768px) {
      height: 200px;
    }
    @media (max-width: 480px) {
      height: 165px;
    }
    img{
      object-fit: cover;
    }
  }
</style>
