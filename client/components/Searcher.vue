<template>
  <section class="container field hero">
    <div class="background">
      <img class="photo" src="http://acomeradmin.cl/img/bg-cotizador.jpg" alt />
    </div>

    <div class="control has-text-centered">
      <img src="../assets/img/logo.png" class="logo image" />
      <h1 class="title is-3">¿Qué quieres comer hoy? {{ubication}}</h1>
      <input
        v-model="searchQuery"
        class="input"
        type="text"
        placeholder="Busca por nombre, dirección o categoría."
      />
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["searching"],
  data() {
    return {
      searchQuery: "",
      ubication: ""
    };
  },
  methods: {
    ...mapActions(["search", "setSearching"])
  },
  updated() {
    if (this.searchQuery === "") {
      this.setSearching(false);
    } else {
      this.search(this.searchQuery);
    }
  }
};
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .control {
    padding: 40px 4% !important;
  }
  .title {
    font-size: 1.45rem;
  }
  .title.is-3 {
    font-size: 1.35rem;
  }
  .logo {
    max-width: 165px !important;
  }
  .control {
    input {
      font-size: 15px !important;
    }
  }
}
@media (max-width: 468px) {
  .logo {
    max-width: 145px !important;
  }
  .control {
    padding: 25px 4% !important;
    input {
      width: 100% !important;
      font-size: 13.4px !important;
      padding-top: 1.5px;
      margin-bottom: 0px !important;
      padding-bottom: 1.5px;
      margin-left: 1% !important;
    }
    .button {
      width: 50% !important;
      font-size: 14px;
      padding-top: 1.3px !important;
      padding-bottom: 1.3px !important;
      svg {
        margin-left: 10px;
      }
    }
  }
}
@media (max-width: 378px) {
  .logo {
    max-width: 138px !important;
  }
  .control {
    padding: 50.5px 4% !important;
  }
}
.hero {
  height: auto;
  overflow: hidden;
  background: black;
  max-width: 1368px;
  width: 100%;
  .logo {
    max-width: 200px;
    display: inline-block;
  }
  .control {
    padding: 55px 13%;
    z-index: 2;
    position: relative;
    .comuna {
      width: 30%;
      margin: 0;
      -webkit-appearance: none;
      align-items: center;
      border: 1px solid transparent;
      border-radius: 4px;
      box-shadow: none;
      display: inline-flex;
      font-size: 1rem;
      height: 2.25em;
      justify-content: flex-start;
      line-height: 1.5;
      padding-bottom: calc(0.375em - 1px);
      padding-left: calc(0.625em - 1px);
      padding-right: calc(0.625em - 1px);
      padding-top: calc(0.375em - 1px);
      position: relative;
      vertical-align: top;
    }
    input {
      width: 56%;
      float: left;
      margin-left: 2%;
      &::placeholder {
        color: #7d7d7d;
      }
    }
    h1 {
      color: white;
    }
    button,
    a {
      width: 10%;
      margin-left: 2%;
      // margin-top: 15px;
      // margin-bottom: 15px;
    }
  }
  .background {
    position: absolute;
    z-index: 1;
    img {
      opacity: 0.5;
      position: relative;
      z-index: 1;
      @media (max-width: 680px) {
        width: 120%;
        max-width: inherit !important;
        margin-left: -10%;
      }
      @media (max-width: 420px) {
        width: 130%;
        max-width: inherit;
        margin-left: -15%;
      }
      @media (max-width: 380px) {
        width: 145%;
        max-width: inherit;
        margin-left: -22.5%;
      }
    }
  }
}
</style>
