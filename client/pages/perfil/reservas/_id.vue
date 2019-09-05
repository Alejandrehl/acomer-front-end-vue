<template>
  <div class="perfil" v-if="user">
    
    <ReservationDetail v-if="active_reserve_id != 0" 
    :reserve_id="active_reserve_id" :showModal="modals.reservation_detail" />
    <div class="info_card">
      <h2>Mis Reservas</h2>
      <div v-for="reserve in reserves" :key="reserve.id" class="reserve">
        <h2 v-if="reserve.mode == 'take'">Reserva en "{{reserve.order.branch.name}}" para llevar</h2>
        <h2 v-else>Reserva en "{{reserve.order.branch.name}}" para {{reserve.number_people}} personas</h2>
        <p>Fecha: {{reserve.reservation_day.substr(0, 10) }} a las {{reserve.reservation_hour.substr(11, 5) }}</p>
        <button class="btn acomer-button" @click="handleShowReservationDetail(reserve.id)">Ver detalle</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { qvoService, qvoApi } from "~/components/services/qvo-services.js";
import api from "~/components/services/acomer-services.js";
import ReservationDetail from "~/components/modals/ReservationDetail.vue";

export default {
  data() {
    return {
      file: "",
      reserves: [],
      orders: [],
      active_reserve_id: 0
    };
  },
  components: {
    ReservationDetail
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
      "toggle_modal_state"
    ]),
    handleShowReservationDetail: function(reserve_id) {
      this.active_reserve_id = reserve_id
      this.toggle_modal_state({name: 'reservation_detail', value: true})
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
    margin: 10px auto 5px;
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
