<template>
  <div id="app">
 
    <lightbox
      id="mylightbox"
      :images="images"
      :image_class=" 'img-responsive img-rounded image' "
      :album_class=" 'my-album-class' "
      :options="options">
    </lightbox>
 
  </div>
</template> 
<script>
  import Lightbox from 'vue-simple-lightbox'
  export default {
    components: {
      Lightbox
    },
    props: ['images'],
    data(){
      return{
        options : {
          closeText : 'x',
          preloading : true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.lb{
  float: left;
  width: 100%;
  background: #ffffff;
  padding: 10px;
  border-radius: 10px;
  .album-lb{
    float: left;
  width: 100%;
    a{
      float: left;
      width: 100%;
      height: 120px;
      .item-lb{
        float: left;
        width: 100% ;
        height: 120px !important;
      }
    }
  }
}
</style>
