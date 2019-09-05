<template>
  <div id="app">
    <!-- ¿Desde que mesa estás llamando?' -->
    <AcomerModalTable :showModal="modals.call_waiter" />
    <Authentication :showModal="modals.authentication" />

    <nav :class="insideLocalPageWithTables ? 'four_buttons': 'three_buttons'">
      <button @click="redirectToBack">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </button>
      <button @click="redirectToHome">
        <font-awesome-icon :icon="['fas', 'search']" />
      </button>
      <button @click="handleClickModal('call_waiter')" v-if="insideLocalPageWithTables">
        <font-awesome-icon :icon="['fas', 'concierge-bell']" />
      </button>
      <button @click="goToPageUser(user.id)" v-if="isAuthenticated">
        <img :src="user.image" :alt="user.name" v-if="user.image" class="profile_picture" />
        <img src="~/assets/img/miss.png" class="profile_picture" v-else />
      </button>
      <button @click="handleClickModal('authentication')" v-else>
        <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
      </button>
    </nav>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AcomerModalTable from "~/components/modals/AcomerModalTable.vue";
import Authentication from "~/components/modals/Authentication.vue";

export default {
  components: {
    AcomerModalTable,
    Authentication
  },
  updated() {
    if (this.isAuthenticated) {
      this.$store.dispatch("toggle_modal_state", {
        name: "authentication",
        value: false
      });
    }
  },
  computed: {
    ...mapState([
      "menuId",
      "userPosition",
      "branchData",
      "isAuthenticated",
      "modals",
      "user",
      "fbToken"
    ]),
    insideLocalPageWithTables: function() {
      if (
        (this.$route.path.includes("/cartas") ||
          this.$route.path.includes("/productos") ||
          this.$route.path.includes("/categorias") ||
          this.$route.path.includes("/sucursales")) &&
        this.branchData.has_tables != false
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions(["handleUserPoisition", "logout"]),

    redirectToBack() {
      this.$router.go(-1);
    },

    redirectToHome() {
      this.$router.push({ name: "index" });
    },

    goToPageUser(id) {
      this.$router.push({ name: "perfil-id", params: { id } });
    },

    handleClickModal(modal_name) {
      this.$store.dispatch("toggle_modal_state", {
        name: modal_name,
        value: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-toggle {
  width: 45%;
  position: fixed;
  height: -webkit-fill-available;
  background: #212121;
  z-index: 4;
}
nav {
  width: 100%;
  position: fixed;
  z-index: 4;
  background: white;
  padding-left: 80%;
  top: 0;
  @media screen and(max-width: 769px) {
    padding-left: 70%;
  }

  @media screen and(max-width: 600px) {
    bottom: 0;
    top: initial;
    padding-left: 0;
  }
}
button {
  height: 40px;
  border: none;
  float: left;
  background: none;
  z-index: 5;
  text-align: center;
  left: 7.5px;
  font-size: 18px;
  color: #fbe700;
  .profile_picture {
    border-radius: 50px;
    width: 25px;
    height: 25px;
    object-fit: cover;
  }
}
.three_buttons {
  button {
    width: calc(100% / 3);
    outline: none;
  }
}

.four_buttons {
  button {
    width: calc(100% / 4);
    outline: none;
  }
}
</style>
