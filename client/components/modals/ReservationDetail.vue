<template>
  <Modal
    class="modal_standard"
    :show="showModal"
    @close-modal="toggle_modal_state({name:'reservation_detail', value: false})"
  >
    <div class="field" v-if="reserve.id">
      <h1>
        Reserva en
        <nuxt-link
          :to="{name: 'sucursales-id', params: { id: reserve.order.branch_id } }"
        >{{reserve.branch}}</nuxt-link>
      </h1>
      <div class="columns is-mobile mb-0">
        <div class="column">
          <img :src="qr" alt />
        </div>
        <div class="column has-text-left">
          <h2 v-if="reserve.mode == 'take'">Reserva para llevar</h2>
          <h2 v-else>Reserva para {{reserve.number_people}} personas</h2>

          <h2>Fecha: {{reserve.reservation_day.substr(0, 10) }} a las {{reserve.reservation_hour.substr(11, 8) }}</h2>
          <h2>Número de reserva: {{reserve.id}}</h2>
        </div>
      </div>
      <div class="table_detail">
        <table class="table_modal_products">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in reserve.orderproducts" :key="detail.id">
              <td>{{detail.product}}</td>
              <td>{{detail.quantity}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="btn acomer-button" @click="createPDF">
        Descargar PDF de la Reserva
        <font-awesome-icon :icon="['fas', 'file-download']" />
      </button>
    </div>
  </Modal>
</template>

<script>
import { mapActions, mapState } from "vuex";
import api from "~/components/services/acomer-services.js";
import adminApi from "~/components/services/acomer-admin-services";
import jsPDF from "jspdf";
import Modal from "~/components/modals/Modal.vue";

export default {
  props: {
    reserve_id: {
      value: 0
    },
    showModal: {
      default: false
    }
  },
  data() {
    return {
      reserve: {},
      qr: "",
      order: {}
    };
  },
  watch: {
    reserve_id: function() {
      self = this;
      api.get(`api/reserves/${this.reserve_id}`).then(function(response) {
        // Obtiene el código qr
        adminApi
          .get(
            `/reserve/${self.reserve_id}.json?transaction_id=${response.data.reserve.order.transaction_id}`
          )
          .then(function(response) {
            self.reserve = response.data;
            self.qr = response.data.qr;
          });
      });
    }
  },
  created: function() {
    self = this;
    api.get(`api/reserves/${this.reserve_id}`).then(function(response) {
      // Obtiene el código qr
      adminApi
        .get(
          `/reserve/${self.reserve_id}.json?transaction_id=${response.data.reserve.order.transaction_id}`
        )
        .then(function(response) {
          self.reserve = response.data;
          self.qr = response.data.qr;
        });
    });
  },
  methods: {
    ...mapActions(["toggle_modal_state"]),
    createPDF() {
      let pdfName = `Reserva por Acomer ${this.reserve_id}`;
      if (this.reserve.mode == "take") {
        var state = "Para Llevar";
      } else {
        var state = "Para Servir";
      }
      var doc = new jsPDF();
      var img = new Image();
      img.src = "https://acomeradmin.cl/img/logo.png";
      doc.setFontSize(22);
      doc.text(60, 30, `Reserva por Acomer: ${this.reserve_id}`);

      doc.setFontSize(16);
      doc.text(20, 45, `ID: ${this.reserve_id}`);
      doc.text(20, 55, `Modalidad: ${state}`);
      doc.text(20, 65, `Dia: ${this.reserve.reservation_day.substr(0, 10)}`);
      doc.text(20, 75, `Hora: ${this.reserve.reservation_hour.substr(11, 8)}`);
      if (this.reserve.mode != "take") {
        doc.text(20, 85, `Numero de personas: ${this.reserve.number_people}`);
      }
      doc.addImage(this.qr, 120, 35, 50, 50);
      doc.addImage(img, 65, 5, 75, 15);
      doc.save(pdfName + ".pdf");
    }
  },
  components: {
    Modal
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin: 5px 0 20px;
}
label {
  font-size: 16px;
  @media (max-width: 360px) {
    width: 100%;
    font-weight: 400;
    font-size: 13px;
  }
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
.action {
  margin-bottom: 20px;
  button {
    width: 100%;
    // text-transform: uppercase;
    font-weight: 600;
    font-size: 16px;
  }
}

.modalidad-pedido {
  float: left;
  width: 100%;
  label {
    width: 48% !important;
    float: left;
    margin: 0 1%;
    text-align: left;
  }
}

button:disabled {
  background: #ccc;
}

.table_modal_products {
  width: 100%;
  margin-bottom: 15px;

  td,
  th {
    padding: 3px 10px;
    color: #545454;
    border: 1px solid #868686;
  }
  thead {
    background: #fbe700;
    color: #545454;
    th {
      font-size: 14px;
      font-weight: 800;
    }
  }

  td {
    font-weight: 500;
    font-size: 12.5px;
  }
}

h2 {
  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 6px;
  }
}
.acomer-button {
  font-weight: 400 !important;
  margin: 4px 0 8px;
}

.table_detail {
  max-height: 110px;
  overflow: scroll;
}
</style>