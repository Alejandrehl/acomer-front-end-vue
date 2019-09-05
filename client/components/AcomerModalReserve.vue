<template>
  <Modal
    class="acomer_modal pedido_dentro_local_modal"
    :show="showModal"
    @close-modal="toggle_modal_state({name:'reserve',value:false})"
  >
    <h1>{{title}}</h1>
    <div class="modalidad-pedido">
      <label>
        Servir
        <input type="radio" value="serve" v-model="tipo" />
      </label>
      <label>
        Llevar
        <input type="radio" value="take" v-model="tipo" />
      </label>
    </div>
    <div class="fecha-reserva-pedido">
      <div class="field">
        <label>Día de la reserva</label>
        <input type="date" class="field" v-model="day" />
      </div>
    </div>
    <div class="fecha-pedido">
      <div class="field">
        <label>Hora de la reserva</label>
        <input type="time" class="field" v-model="hour" />
      </div>
    </div>
    <div class="fecha-pedido">
      <div class="field" v-if="tipo == 'serve'">
        <label>Nro de personas</label>
        <input type="number" class="field" v-model="people" />
      </div>
    </div>
    <div class="action">
      <h2>{{error}}</h2>

      <template v-if="user"> 
        <button class="acomer-button"  @click="handleReserveButton('webpayplus')">
          Reservar vía webpayplus <img src="~/assets/img/logos/webpayplus.png">
        </button>
        <template v-if="user_client">
          <button :disabled="user_client.default_payment_method == null" class="acomer-button"  @click="handleReserveButton('onepay')">
            Reservar vía onepay <img src="~/assets/img/logos/webpay_oneclick.png"/>
          </button>
        </template>
        <template v-else>
          <button :disabled="true" class="acomer-button"  @click="handleReserveButton('onepay')">
            Reservar vía onepay <img src="~/assets/img/logos/webpay_oneclick.png"/>
          </button>
        </template>
      </template>

      <template v-else>
        <button class="acomer-button" @click="$emit('needLogin')">
          Reservar vía webpayplus <img src="~/assets/img/logos/webpayplus.png">
        </button>
        <button :disabled="true" class="acomer-button"  @click="$emit('needLogin')">
          Reservar vía onepay <img src="~/assets/img/logos/webpay_oneclick.png"/>
        </button>
      </template>
      <!-- <template v-if="!user_client"> -->
        <template v-if="!user_client.default_payment_method">
          <label v-if="user">¡<a @click="linkToPerfil(user.id)">Registra tu tarjeta</a> y paga con solo un click!</label>
          <label v-else>¡<a @click="createAccountModalToggle">Crea tu cuenta</a>, <a @click="linkToPerfil">registra tu tarjeta</a> y paga con solo un click!</label>
        <!-- </template> -->
      </template>
    </div>
  </Modal>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Modal from "~/components/modals/Modal.vue";
const moment = require("moment");

export default {
  name: "AcomerModalReserve",
  props: ["title", "showModal"],
  components: {
    Modal
  },
  data() {
    return {
      tipo: "",
      hour: '00:00',
      people: '00:00',
      day: '00:00',
      error: ""
    };
  },
  methods: {
    ...mapActions(["toggle_modal_state"]),
    handleReserveButton(tipo_pago) {
      // Si el usuario especifico día y hora
      if (this.day && this.hour) {
        // Establece la fecha seleccionada, se calcula con el día y la hora
        var date_f = moment(`${this.day}`);
        date_f.hours(this.hour.substring(0, 2));
        date_f.minutes(this.hour.substring(3, 5));

        // Se establece la fecha y hora actual
        var today = moment();

        // Establece la hora limite de la reserva
        // Se calcula con la fecha actual, mas las horas de adelanto que debe tener segun el local
        // Por defecto 1 hora
        var reservation_limit = moment();
        reservation_limit.add(1, "hour");
      }
      if (!this.tipo) {
        this.error = "Debes ingresar tu tipo de reserva";
      } else if (!this.day) {
        this.error = "Debes ingresar el día de la reserva";
        // Variable para la fecha final, es igual al día elegido, con la hora elegida
      } else if (date_f < reservation_limit) {
        this.error =
          "La fecha minima para pedir por adelantado es para" +
          reservation_limit.format("MM-DD-YYYY HH:mm");
      } else if (!this.hour) {
        this.error = "Debes ingresar la hora de la reserva";
      } else if (this.tipo == "adsasd" && this.people < 1) {
        this.error = "Debes especificar número de personas";
      } else {
        var data = {
          tipo: this.tipo,
          hour: this.hour,
          day: this.day,
          people: this.people
        };

        this.$emit("makeOrder", 0, "reservation", tipo_pago, data);
        this.error = "";
      }
    },
    linkToPerfil: function(id) {
      this.$router.push({ name: "perfil-id", params: { id } })
      this.toggle_modal_state({ name:'reserve', value:false })
    },
    createAccountModalToggle: function(id){
      this.toggle_modal_state({ name: "reserve", value: false });
      this.toggle_modal_state({ name: "authentication", value: true });
    }
  },
  computed: {
    ...mapState(['user_client','user'])
  },
};
</script>

<style lang="scss" scoped>
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
      margin-bottom: 13px;
      .field,
      input {
        width: 100%;
      }
    }
    .fecha-pedido {
      float: left;
      width: 100%;
      margin-bottom: 13px;
      .field {
        width: 98%;
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
.action {
  h2 {
    color: red;
    font-size: 14px;
    text-align: center;
  }
}
.modalidad-pedido {
  float: left;
  width: 100%;
  margin-bottom: 13px;
  label {
    width: 48% !important;
    float: left;
    margin: 0 1%;
    text-align: center;
  }
  input {
    width: 48%;
    margin: 0 1%;
  }
}
</style>