<template>
  <div class="perfil" v-if="user">
    <OrderDetail 
    v-if="active_order_id != 0"
    :order_id="active_order_id" 
    :showModal="modals.order_detail"/>
    <div class="info_card">
      <h2>Mis Pedidos</h2>
      <div v-for="order in orders" :key="order.id" class="reserve">
        <h2>Orden en {{order.branch.name}}</h2>
        <p>Fecha: {{order.createdAt.substr(0, 10)}} a las {{order.createdAt.substr(11, 5)}}</p>
        <!-- <p>Medio de pago {{order.payment_method}}</p> -->
        <p>Total: {{order.total}}</p>
        <button class="btn acomer-button" @click="handleShowOrderDetail(order.id)">Ver detalle</button>
      </div>
    </div>

    <button class="logout_button button acomer-button" @click="logout">Cerrar sesión</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { qvoService, qvoApi } from "~/components/services/qvo-services.js";
import api from "~/components/services/acomer-services.js";
import OrderDetail from "~/components/modals/OrderDetail.vue";

export default {
  data() {
    return {
      file: "",
      reserves: [],
      orders: [],
      active_order_id: 0
    };
  },
  components: {
    OrderDetail
  },
  computed: {
    ...mapState(["user", "user_client", "message", "modals"])
  },
  created: function() {
    const self = this;
    api
      .get(`api/reserves/user/${this.$route.params.id}`)
      .then(function(response) {
        self.reserves = response.data;
      });

    api
      .get(`api/users/orders/${this.$route.params.id}`)
      .then(function(response) {
        self.orders = response.data;
      });
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
    handleShowOrderDetail: function(order_id) {
      this.active_order_id = order_id
      this.toggle_modal_state({name: 'order_detail', value: true})
    },
    onSelect() {
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
.perfil {
  text-align: center;
  display: block;
  padding: 15px 15px;
  .profile_picture {
    display: inline-block;
    border-radius: 100%;
    width: 200px;
    margin: 15px 0;
    object-fit: cover;
  }
}

.info_user {
  margin: 10px 0 35px;
  background: #ffffff;
  padding: 15px;
  border-radius: 15px;
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
  display: block;
  background: #ffffff;
  padding: 15px;
  border-radius: 15px;
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
    left: 15%;
    opacity: 0.1;
    width: 70%;
    max-width: inherit;
    top: 15%;
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
