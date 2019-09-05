<template>
  <div>
    <AcSearcher v-if="!isloading" :searching="searching" />
    <section id="founded-section" class="container ac-mobile-container" v-if="foundedBranches">
      <h2 class="title is-3">Buscando: {{searchQuery}} ({{foundedBranches.length}})</h2>
      <AcBranch v-for="local in foundedBranches" :key="local.id" :local="local" />
    </section>

    <section id="featured-branches-section" class="container ac-mobile-container" v-else>
      <h2 class="title is-3">Locales Destacados</h2>
      <AcBranch v-for="local in featuredBranches" :key="local.id" :local="local.branch" />
    </section>
  </div>
</template>

<script>
import OwlCarousel from "vue-owl-carousel";
import AcBranch from "~/components/Branch.vue";
import AcSearcher from "~/components/Searcher.vue";
import api from "~/components/services/acomer-services";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      isloading: false
    };
  },
  computed: {
    ...mapState([
      "featuredBranches",
      "isAuthenticated",
      "searching",
      "searchQuery",
      "allBranches",
      "foundedBranches"
    ])
  },
  created() {
    this.getFeaturedBranches();
    this.loadBranches();
  },
  methods: {
    ...mapActions(["getFeaturedBranches", "loadBranches"])
  },
  components: {
    OwlCarousel,
    AcBranch,
    AcSearcher
  }
};
</script>
  

<style lang="scss" scoped>
@media (max-width: 768px) {
  .title {
    font-size: 1.45rem;
  }
  .title.is-3 {
    font-size: 1.35rem;
  }
}
section {
  margin-bottom: 45px;
}

h2 {
  font-weight: 400;
}

.carousel-alianzas {
  img {
    max-width: 180px;
    margin: 0 auto;
  }
}
.medios-de-pago {
  text-align: center;
  img {
    max-width: 180px;
    margin: 0 auto;
  }
}

.background_foto {
  background-attachment: fixed;
  background-size: 100%;
  h1,
  h2,
  h3,
  h4,
  h5,
  p {
    color: white;
  }
}

.hero-body {
  .texto {
    width: 70% !important;
    float: left;
    margin: 0 !important;
  }

  img {
    width: 15% !important;
    float: left;
    margin: 0 10% 0 5 !important;
  }
}
</style>
