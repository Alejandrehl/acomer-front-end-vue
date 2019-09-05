<template>
  <div class="perfil" v-if="user">
    <div class="info_user">
      <img :src="user.image" :alt="user.name" v-if="user.image" class="profile_picture" />
      <img src="~/assets/img/miss.png" class="profile_picture" v-else />
      <div class="file">
        <form @submit.prevent="onSubmit" enctype="multipart/form-data">
          <div class="fields">
            <label>Subir imagen</label>
            <input type="file" class="button" ref="file" @change="onSelect" />
          </div>
          <div class="fields">
            <button class="button acomer-button">Enviar</button>
          </div>
          <div class="message">
            <h5>{{ message }}</h5>
          </div>
        </form>
      </div>

      <h1 class="title is-4" v-if="user.last_name">{{user.name + ' ' + user.last_name}}</h1>
      <h1 class="title is-4" v-else>{{ user.name }}</h1>
      <h2>Email: {{user.email}}</h2>
      <h2>Usuario de Acomer desde: {{user.created_at.substr(0,10)}}</h2>
    </div>
    <div class="info_card">
      <nuxt-link
        class="acomer-button button"
        :to="{name: 'perfil-ordenes-id', params: { id: this.$route.params.id } }"
      >Ordenes</nuxt-link>
      <nuxt-link
        class="acomer-button button"
        :to="{name: 'perfil-reservas-id', params: { id: this.$route.params.id } }"
      >Reservas</nuxt-link>
    </div>
    <div class="info_card">
      <h2 class="subtitle is-5">Medios de pago</h2>
      <template v-if="!user_client ||  !user_client.default_payment_method">
        <p>Registra tu tarjeta de credito para pagar con solo un click!</p>
        <button
          class="button acomer-button"
          @click="handleClickCardSubscription(user)"
        >Inscribir tarjeta</button>
        <div class="brand">
          <img src="~/assets/img/logos/webpay_one_click.png" />
        </div>
      </template>
      <template v-if="user_client">
        <template v-if="user_client.default_payment_method">
          <div class="credit_card card" v-if="user_client">
            <div class="columns">
              <div class="column is-12">
                <img src="~/assets/img/logo.png" class="card_background" />
              </div>
            </div>
            <div class="columns">
              <div class="card_numbers column is-12">
                <h5
                  class="has-text-left subtitle is-6"
                >xxxx xxxx xxxx {{user_client.default_payment_method.last_4_digits}}</h5>
              </div>
            </div>
            <div class="columns is-mobile">
              <div class="column is-7">
                <div class="card_name">
                  <h4 class="title is-6 has-text-left">{{ user.name }}</h4>
                </div>
              </div>
              <div class="column is-5">
                <div class="card_type">
                  <img
                    src="~/assets/img/logos/visa.png"
                    v-if="user_client.default_payment_method.card_type == 'Visa'"
                  />
                  <img
                    src="~/assets/img/logos/mastercard.svg"
                    v-if="user_client.default_payment_method.card_type == 'Master card'"
                  />
                </div>
              </div>
            </div>
          </div>
          <button class="acomer-button button" @click="handleDeleteCard">Eliminar tarjeta</button>
        </template>
      </template>
    </div>

    <button class="logout_button button acomer-button" @click="logout">Cerrar sesión</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { qvoService, qvoApi } from "~/components/services/qvo-services.js";
import api from "~/components/services/acomer-services.js";

export default {
  data() {
    return {
      file: "",
      reserves: [],
      orders: []
    }
  },
  computed: {
    ...mapState(["user", "user_client", "message", "modals"])
  },
  methods: {
    ...mapActions([
      "saveUserClient",
      "logout",
      "uploadUserImage",
      "toggle_modal_state"
    ]),
    handleClickCardSubscription: function(user) {
      var self = this;
      if (process.env.NODE_ENV === "production") {
        var return_url = "https://acomerapp.cl" + self.$route.fullPath;
      } else {
        var return_url = "http://localhost:4000" + self.$route.fullPath;
      }

      // Verifica si ya está inscrito como cliente
      qvoService
        .userIsClient(user.email)
        // Si lo está
        .then(function(response) {
          self.saveUserClient(response);
          // Inscribe su tarjeta
          qvoService
            .handleUserCardInscription(response.client.id, return_url)
            .then(function(response) {});
        })
        // Si no lo está
        .catch(function(response) {
          // Inscribe al usuario

          qvoService
            .handleUserInscription(self.user.email, self.user.name)
            .then(function(response) {
              // Acá se debe guardar en el state el client
              // Luego de inscrito, inscribe su tarjeta
              self.saveUserClient(response);
              qvoService
                .handleUserCardInscription(response.client.id, return_url)
                .then(function(response) {});
            });
        });
    },
    handleDeleteCard: function() {
      self = this;
      qvoApi
        .delete(
          `customers/${this.user_client.id}/cards/${this.user_client.default_payment_method.id}`
        )
        .then(function(response) {
          self.$swal({
            title: "Tarjeta eliminada correctamente",
            type: "success"
          });
          setTimeout(function() {
            location.reload();
          }, 1500);
        });
    },
    onSelect: function() {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const file = this.$refs.file.files[0];
      this.file = file;

      if (!allowedTypes.includes(file.type)) {
      }

      if (file.size > 500000) {
      }
    },
    async onSubmit() {
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("user_id", this.user.id);
      this.uploadUserImage(formData);
    }
  }
};
</script>

<style lang="scss" scoped>
.card_numbers {
  margin-top: 30px;
}
.card_type {
  float: right;
  margin-bottom: 15px;
  img {
    float: right !important;
  }
}
.file{
  form{
    width: 100%;
    float: left;
  }
}
.perfil {
  width: 100%;
  text-align: center;
  display: block;
  float: left;
  padding: 15px 15px;
  margin-top: 90px;
  .profile_picture {
    display: inline-block;
    border-radius: 100%;
    width: 200px;
    height: 200px;
    margin: 15px 0;
    object-fit: cover;
  }
}

.info_user {
  width: calc(95%/2);
  float: left;
  margin: 10px 5px 35px;
  background: #ffffff;
  padding: 15px;
  border-radius: 15px;
  @media screen and(max-width:700px){
    width:100%;
  }
  input {
    width: 100%;
    margin: 20px 0;
  }
  h1 {
    margin: 20px 0;
  }
  label {
    font-weight: bold;
  }
}
.info_card {
  width: calc(100%/2);
  float: left;
  margin: 15px 5px;
  display: block;
  background: #ffffff;
  padding: 15px;
  border-radius: 15px;
  margin-bottom: 30px;
  @media screen and(max-width:846px){
    width: calc(95%/2);
  }
  @media screen and(max-width:700px){
    width:100%;
  }
  h2 {
    text-align: left;
    font-weight: bold;
  }
  p {
    text-align: left;
  }
  button {
    width: 50%;
    margin: 25px auto 10px;
    display: block;
  }
  .brand {
    width: 50%;
    margin: 15px auto 25px;
    display: block;
    img {
      max-width: 100px;
    }
  }
}

.credit_card {
  padding: 10px 20px;
  border-radius: 5px;
  background: #3a3a3a;
  border: 1px solid #fbe700;
  // width: 80%;
  // margin: 10px 10%;
  .card_background {
    position: absolute;
    left: 5%;
    opacity: 0.9;
    width: 35%;
    max-width: inherit;
    top: 10%;
  }
  img {
    max-width: 60px;
  }
  h3,
  h4,
  h5,
  h6,
  p {
    color: white;
  }
}
.logout_button {
  margin-top: 30px;
}

.reserve {
  background: #fff;
  padding: 10px;
  margin: 15px 0;
  border: solid 1px #fbe700;
  border-radius: 10px;
}
</style>
