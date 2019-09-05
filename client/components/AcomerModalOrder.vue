<template>
  <Modal
    class="acomer_modal pedido_dentro_local_modal"
    :show="showModal"
    @close-modal="toggle_modal_state({name:'order',value:false})"
  >
    <template v-if="branchData.has_tables != false">
      <h1>Pedido dentro del local</h1>
      <div class="form-numero-de-mesa">
        <div class="field" v-if="tables">
          <label>¿En que mesa te encuentras?</label>
          <select v-model="table_id">
            <option
              v-for="table in tables"
              :key="table.id"
              :value="table.id"
            >{{table.id}} {{table.description}}</option>
          </select>
        </div>
        <div class="field" v-else>
          <!-- Loader gif -->
          <div class="loader"></div>
          <p>Estamos cargando tus mesas</p>
        </div>
      </div>
    </template>
    <template v-if="branchData.has_tables == false">
      <h1>Selecciona tu metodo de pago 💳 💵</h1>
    </template>
    <div class="action">
      <template v-if="table_id || branchData.has_tables == false">
        <button
          class="acomer-button"
          @click="$emit('WebPayPlusPay', table_id, 'order', 'webpayplus')"
        >
          Pagar online
          <img src="~/assets/img/logos/webpayplus.png" />
        </button>
        <button
          class="acomer-button"
          @click="$emit('orderInsideLocalInPerson', table_id, 'order', 'cash')"
        >
          Medios de pago del local
          <font-awesome-icon :icon="['fas', 'money-bill-alt']" />
          <font-awesome-icon :icon="['fas', 'credit-card']" />
        </button>
        <button
          v-if="user_client"
          :disabled="user_client.default_payment_method == null"
          class="acomer-button"
          @click="$emit('OneClickPay', table_id, 'order', 'onepay')"
        >
          Pago con un click
          <img src="~/assets/img/logos/webpay_oneclick.png" />
        </button>
        <button
          v-else
          :disabled="true"
          class="acomer-button"
          @click="$emit('OneClickPay', table_id, 'order', 'onepay')"
        >
          Pago con un click
          <img src="~/assets/img/logos/webpay_oneclick.png" />
        </button>
      </template>
      <template v-else>
        <button class="acomer-button" @click="validateTableId">
          Pagar online
          <img src="~/assets/img/logos/webpayplus.png" />
        </button>
        <button class="acomer-button" @click="validateTableId">
          Medios de pago del local
          <font-awesome-icon :icon="['fas', 'money-bill-alt']" />
          <font-awesome-icon :icon="['fas', 'credit-card']" />
        </button>
        <button
          v-if="user && user_client"
          :disabled="user_client.default_payment_method == null"
          class="acomer-button"
          @click="validateTableId"
        >
          Pago con un click
          <img src="~/assets/img/logos/webpay_oneclick.png" />
        </button>
        <button v-else :disabled="true" class="acomer-button" @click="validateTableId">
          Pago con un click
          <img src="~/assets/img/logos/webpay_oneclick.png" />
        </button>
      </template>
      <template v-if="!user_client.default_payment_method">
        <label v-if="user">
          <a @click="linkToPerfil(user.id)">¡Registra tu tarjeta</a> y paga con solo un click!
        </label>
        <label v-else>
          <a @click="createAccountModalToggle">¡Crea tu cuenta</a>,
          <a @click="linkToPerfil">registra tu tarjeta</a> y paga con solo un click!
        </label>
      </template>
    </div>
  </Modal>
</template>

<script>
import { mapActions, mapState } from "vuex";
import api from "~/components/services/acomer-services.js";
import Modal from "~/components/modals/Modal.vue";

export default {
  name: "AcomerModalOrder",
  props: ["title", "showModal"],
  data() {
    return {
      tables: [],
      table_id: ""
    };
  },
  components: {
    Modal
  },
  computed: {
    ...mapState(["user", "menuId", "branchData", "user_client"])
  },
  watch: {
    showModal: function() {
      var self = this;
      if (self.tables.length < 1) {
        api
          .get("/api/tables/branch/" + this.branchData.branch_id)
          .then(function(response) {
            self.tables = response.data;
          });
      }
    }
  },
  methods: {
    ...mapActions(["toggle_modal_state"]),
    validateTableId: function() {
      this.$toast.show("Debes ingresar un número de mesa", {
        type: "error",
        duration: 1500
      });
    },
    linkToPerfil: function(id) {
      this.$router.push({ name: "perfil-id", params: { id } });
      this.toggle_modal_state({ name: "order", value: false });
    },
    createAccountModalToggle: function(id) {
      this.toggle_modal_state({ name: "order", value: false });
      this.toggle_modal_state({ name: "authentication", value: true });
    }
  }
};
</script>

<style lang="scss" scoped>
select {
  border: solid 1px #ccc;
  border-radius: 5px;
  background: #fff;
  outline: none;
}
.action {
  button {
    width: calc(98% / 3);
    @media screen and(max-width:763px) {
      width: 100%;
    }
  }
}
.acomer_modal {
  background: white;
  position: fixed;
  z-index: 100;
  padding: 15px;
  width: 80%;
  @media (max-width: 600px) {
    width: 90% !important;
    margin: 20% 5% !important;
    padding: 10px 15px !important;
    height: auto !important;
    h1 {
      margin: 20px 0;
      font-size: 18px;
      text-align: center;
    }
    label {
      font-size: 16px;
    }
    input {
      width: 100%;
      border: 1px solid #a2a2a2;
      border-radius: 3px;
      text-align: center;
    }

    .fecha-reserva-pedido {
      float: left;
      width: 100%;
      margin-top: 16px;
      margin-bottom: 16px;
      .field,
      input {
        width: 100%;
      }
    }
    .fecha-pedido {
      float: left;
      width: 100%;
      margin-top: 16px;
      margin-bottom: 16px;
      .field {
        width: 48%;
        float: left;
        margin: 0 1%;
        input {
          width: 100%;
        }
      }
    }
  }
  @media (max-width: 360px) {
    label {
      width: 100%;
      font-weight: 400;
      font-size: 13px;
    }
  }
}

.modalidad-pedido {
  float: left;
  width: 100%;
  label {
    width: 48% !important;
    float: left;
    margin: 0 1%;
    text-align: center;
  }
}

button:disabled {
  background: #ccc;
}
</style>