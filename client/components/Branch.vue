<template>
  <div class="card">
    <div class="card-image">
      <figure class="image">
        <img v-show="image" @click="goToBranch(local.id)" :src="image" :alt="local.name" />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-5" @click="goToBranch(local.id)">{{ local.name }}</p>
        </div>
      </div>

      <div class="content"><p>{{ local.information }}</p></div>
    </div>
  </div>
</template> 

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      image: null
    };
  },
  props: ["local"],
  computed: {
    ...mapState(["featuredBranch_first_image"])
  },
  created() {
    let first_image = this.local.image_paths[0];
    if (first_image) {
      this.image = first_image.url;
    } else {
      this.image = "https://acomerapp.cl/_nuxt/img/cdedd7c.png";
    }
  },
  methods: {
    ...mapActions(["setFeaturedBranchFirstImage"]),
    goToBranch(id) {
      this.$router.push({
        name: "sucursales-id",
        params: { id: this.local.id }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  width: 32%;
  border-radius: 5px;
  margin: 0 0.5%;
  float: left;
  @media (max-width: 768px) {
    width: 100%;
    margin: 0 0 20px;
    float: left;
  }
}
.card-image{
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.card-content{
  padding: 1rem;
  .content{
    p{

    display: -webkit-box;
  height: 14px * 1.4 * 3;
  line-height: 1.4;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px !important;
    }
  }
}
</style>
