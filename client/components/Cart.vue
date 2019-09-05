<template>
  <div class="nav" @orderComeplete="emptyCart">
    <modals-container />
    <!-- @WebPayPlusPay="handleOrderInsideLocalOnline" -->
    <!-- modals.loading_transaction -->
    <LoadingTransaction :showModal="modals.loading_transaction" />
    <AcomerModalOrder
      :showModal="modals.order"
      @orderInsideLocalInPerson="handleOrder"
      @WebPayPlusPay="handleOrder"
      @OneClickPay="handleOrder"
    />
    <AcomerModalReserve
      :title="'Ingresa los datos de tu reserva'"
      :showModal="modals.reserve"
      @makeOrder="handleOrder"
      @needLogin="handleNeedLogin"
    />
    <div @click="toggleCart" v-show="cartProducts.length > 0" class="orderBar">
      <h5>
        <font-awesome-icon :icon="['fas', 'shopping-cart']" />
        Tienes {{ cartCount }} productos
      </h5>
    </div>
    <div class="cart" v-if="cartProducts.length > 0 && cartVisibility">
      <div class="order" v-if="cartProducts.length > 0 && cartVisibility">
        <p @click="toggleCart" class="close_icon">
          <font-awesome-icon :icon="['fas', 'times']" />
        </p>
        <h2 class="subtitle is-4">Total: ${{ cartTotal | numFormat}}</h2>
        <div class="products">
          <div class="product" v-for="product in cartProducts" v-bind:key="product.id">
            <div class="product_image">
              <div v-if="!product.image_product_paths[0].url">
                <img src="~assets/img/miss.png" />
              </div>
              <div v-else>
                <img :src="product.image_product_paths[0].url" :alt="product.name" />
              </div>
            </div>
            <div class="product_info">
              <h6>{{ product.name }}</h6>
              <p>${{ product.price | numFormat }}</p>
            </div>
            <div class="product_actions">
              <button @click="handleRemoveProduct(product)">-</button>
              {{ product.quantity }}
              <button
                @click="handleAddProduct({product,quantity: 1})"
              >+</button>
            </div>
          </div>
        </div>
        <div class="aditional_comentary">
          <label>¿Algún comentario para tu orden?</label>
          <input
            class="input"
            type="text"
            placeholder="Ej: ¡Sin palta porfavor!"
            v-model="specification"
          />
        </div>
        <div class="cartActions">
          <button class="acomer-button" @click="toggle_modal_state({name:'order', value:true})">
            Pedir dentro del local
            <font-awesome-icon :icon="['fas', 'utensils']" />
          </button>
          <button class="acomer-button" @click="toggle_modal_state({name:'reserve', value:true})">
            Reserva tu pedido
            <font-awesome-icon :icon="['fas', 'calendar-check']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

import { mapState, mapActions } from "vuex";
import api from "~/components/services/acomer-services";
import adminApi from "~/components/services/acomer-admin-services";
import { qvoService, qvoApi } from "~/components/services/qvo-services";
import AcomerModalOrder from "~/components/AcomerModalOrder.vue";
import AcomerModalReserve from "~/components/AcomerModalReserve.vue";
import Modal from "~/components/modals/Modal.vue";
import LoadingTransaction from "~/components/AcomerLoadingTransaction.vue";

export default {
  data() {
    return {
      cartVisibility: false,
      specification: "",
      actualUrl: this.$route.fullPath,
      mesas: {}
    };
  },
  computed: {
    ...mapState([
      "cartTotal",
      "cartProducts",
      "cartCount",
      "menuId",
      "showModalReserve",
      "showModalOrder",
      "userPosition",
      "modals",
      "user",
      "user_client",
      "branchData"
    ])
  },
  methods: {
    ...mapActions([
      "handleRemoveProduct",
      "handleAddProduct",
      "closeModal",
      "toggle_modal_state",
      "emptyCart",
      "handleReseteCart",
      "saveUserClient",
      "handleUserPoisition"
    ]),
    calculateDistanceBetweenToPoints: function(lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1); // deg2rad below
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    },
    toggleCart() {
      this.cartVisibility = !this.cartVisibility;
    },

    // Recibe como parametro, el id de la mesa, el tipo de orden, y el metodo de pago
    handleOrder(table_id, order_type, method, reservationData) {
      const self = this;
      if (reservationData) {
        console.log(reservationData);
      }
      if (this.cartTotal > 9999999) {
        self.$toast.show(
          "No podemos soportar pagos tan altos, por favor, contacta al local directamente.",
          { type: "error", duration: 1500 }
        );
      } else {
        this.handleUserPoisition().then(function(response) {
          var user_pos = response.data;
          if (order_type == "order") {
            var distance_between_user_and_branch = self.calculateDistanceBetweenToPoints(
              self.branchData.latitude,
              self.branchData.longitude,
              user_pos.latitude,
              user_pos.longitude
            );
            // if (distance_between_user_and_branch > 50) {
            if (distance_between_user_and_branch > 0.5) {
              self.$swal({
                title: "Hubo un error con tu pago",
                text: "No pareces estar cerca del local",
                type: "error"
              });
              return;
            }
          }
          var products = self.cartProducts.map((value, index, array) => {
            return { id: value.id, quantity: value.quantity };
          });

          if (method == "cash") {
            var payment_modality = "Medios dentro del local";
            var payed = false;
          } else if (method == "webpayplus") {
            var payment_modality = "Webpay Plus";
            var payed = true;
          } else if (method == "onepay") {
            var payment_modality = "Webpay OneClick";
            var payed = true;
          }

          if (order_type == "order") {
            var reservation = "no";
            self.toggle_modal_state({ name: "order", value: false });
            self.toggle_modal_state({
              name: "loading_transaction",
              value: true
            });
          } else if (order_type == "reservation") {
            var reservation = "yes";
            self.toggle_modal_state({ name: "reserve", value: false });
            self.toggle_modal_state({
              name: "loading_transaction",
              value: true
            });
          }

          adminApi
            .post("/orders.json", {
              total: self.cartTotal,
              products: products,
              reservation: reservation,
              reservationData: reservationData,
              // Datos estaticos en la carta
              status: "requested",
              specification: self.specification,
              user_id: self.user ? self.user.id : 1,
              menu_id: self.menuId,
              table_id: self.branchData.has_tables == false ? 0 : table_id,
              payment_modality: payment_modality,
              payed: payed
            })
            .then(response => {
              if (process.env.NODE_ENV === "production") {
                var return_url = "https://acomerapp.cl" + self.actualUrl;
              } else {
                var return_url = "http://localhost:4000" + self.actualUrl;
              }
              if (order_type == "order") {
                // Define la url de la redirección según el ambiente
                if (payment_modality == "Webpay Plus") {
                  var order_response_data = response.data;
                  // Ejecuta el cobro, con un monto igual al total del carrito, y retorna a la url definida
                  qvoApi
                    .post("webpay_plus/charge", {
                      amount: self.cartTotal,
                      return_url: return_url
                    })
                    .then(function(response) {
                      var qvo_response_data = response.data;
                      adminApi
                        .post("/orders/transaction", {
                          id: order_response_data.orden.id,
                          status: "requested",
                          payment_method: "",
                          payed: false,
                          transaction_id: qvo_response_data.transaction_id
                        })
                        .then(function(response) {
                          location.replace(qvo_response_data.redirect_url);
                        })
                        .catch(function(e) {
                          self.$toast.show(
                            "Ops! ocurrio un error 😥, contactate con un mesero para hacer tu pedido",
                            { type: "error", duration: 1500 }
                          );
                          self.toggle_modal_state({
                            name: "loading_transaction",
                            value: false
                          });
                          self.handleReseteCart();
                        });
                    });
                } else if (payment_modality == "Webpay OneClick") {
                  if (
                    self.user_client &&
                    self.user_client.default_payment_method
                  ) {
                    // Realiza un cargo en la tarjeta
                    qvoApi
                      .post(
                        `/customers/${self.user_client.id}/cards/${self.user_client.default_payment_method.id}/charge`,
                        {
                          amount: self.cartTotal,
                          description: `Pedido en sucursal: ${self.branchData.branch_id} a travéz de Acomer`
                        }
                      )
                      .then(function(response) {
                        self.$toast.show(
                          "Pago exitoso, ¡tu pedido está en camino! 😉",
                          { type: "success", duration: 6000 }
                        );

                        self.toggle_modal_state({
                          name: "loading_transaction",
                          value: false
                        });
                        self.handleReseteCart();
                      });
                  } else {
                    self.$toast.show(
                      "Debes configurar un medio de pago para usar onepay",
                      {
                        type: "error",
                        duration: 1500
                      }
                    );
                  }
                } else if (payment_modality == "Medios dentro del local") {
                  // Data a enviar hacia backend
                  self.toggle_modal_state({
                    name: "loading_transaction",
                    value: false
                  });
                  self.$toast.show("Tu pedido se ha realizado con exito 😋🍴", {
                    type: "success",
                    duration: 2200
                  });
                }
                self.handleReseteCart();
              } else if (order_type == "reservation") {
                if (payment_modality == "Webpay Plus") {
                  var reservation_response_data = response.data;
                  qvoApi
                    .post("webpay_plus/charge", {
                      amount: self.cartTotal,
                      return_url: return_url
                    })
                    .then(function(response) {
                      var qvo_response_data = response.data;
                      adminApi
                        .post("/orders/transaction", {
                          id: reservation_response_data.orden.id,
                          payment_method: "",
                          transaction_id: qvo_response_data.transaction_id
                        })
                        .then(function(response) {
                          location.replace(qvo_response_data.redirect_url);
                        })
                        .catch(e => {
                          self.$toast.show(
                            "Ops! ocurrio un error 😥, contactate con un mesero para hacer tu pedido",
                            { type: "error", duration: 1500 }
                          );
                          self.toggle_modal_state({
                            name: "loading_transaction",
                            value: false
                          });
                          self.handleReseteCart();
                        });
                    });
                } else if (payment_modality == "Webpay OneClick") {
                  if (
                    self.user_client &&
                    self.user_client.default_payment_method
                  ) {
                    var order_response = response.data;
                    var return_url = "";
                    // Realiza un cargo en la tarjeta
                    qvoApi
                      .post(
                        `/customers/${self.user_client.id}/cards/${self.user_client.default_payment_method.id}/charge`,
                        {
                          amount: self.cartTotal,
                          description:
                            "Pedido a travéz de Acomer en sucursal: sucursal"
                        }
                      )
                      .then(function(response) {
                        self.$toast.show(
                          "Pago exitoso, ¡tu pedido está en camino! 😉",
                          { type: "success", duration: 6000 }
                        );
                        self.toggle_modal_state({
                          name: "loading_transaction",
                          value: false
                        });
                        self.handleReseteCart();
                        this.toggle_modal_state({
                          name: "reserve",
                          value: true
                        });
                        var pay_data = response.data;

                        adminApi
                          .post("/orders/transaction", {
                            id: order_response.orden.id,
                            // payment_method: "Credito",
                            payed: true,
                            transaction_id: pay_data.id
                          })
                          .then(function(response) {
                            adminApi
                              .get(
                                `/reserve/show.json?transaction_id=${pay_data.id}`
                              )
                              .then(function(response) {
                                self.$modal.show(
                                  {
                                    template: `
                          <div class="reservation_result">
                            <h1>¡Tu reserva se realizó correctamente!</h1>
                            <h2>Puedes validar tu reserva con el siguiente codigo</h2>
                            <img :src="qr" />
                            <div class="field">
                              <label>Codigo de reserva</label>
                              <h3>{{code}}</h3>
                            </div>
                            <div class="field">
                              <label>fecha de reserva</label>
                              <h3>{{day}}</h3>
                            </div>
                            <div class="field">
                              <label>hora de reserva</label>
                              <h3>{{hour}}</h3>
                            </div>
                            <div class="field">
                              <label>Nro de persona</label>
                              <h3>{{people}}</h3>
                            </div>
                          </div>
                        `,
                                    props: [
                                      "qr",
                                      "day",
                                      "code",
                                      "hour",
                                      "people"
                                    ]
                                  },
                                  {
                                    qr: response.data.qr,
                                    day: response.data.reservation_day,
                                    code: response.data.id,
                                    people: response.data.number_people,
                                    hour: response.data.reservation_hour
                                  },
                                  {
                                    "before-close": event => {
                                      this.reservationHour;
                                    }
                                  }
                                );
                              });
                          })
                          .catch(e => {
                            console.log("error");
                          });
                      })
                      .catch(function(error) {
                        self.$toast.show(
                          "Ops! ocurrio un error 😥, contactate con un mesero para hacer tu pedido",
                          {
                            type: "error",
                            duration: 1500
                          }
                        );
                      });
                  } else {
                    self.$toast.show(
                      "Debes configurar un medio de pago para usar onepay",
                      {
                        type: "error",
                        duration: 1500
                      }
                    );
                    self.handleClickCardSubscription(self.user);
                  }
                }
              }
            })
            .catch(response => {
              self.$toast.show(
                "Ops! ocurrio un error 😥, contactate con un mesero para hacer tu pedido",
                { type: "error", duration: 1500 }
              );
            });
        }); // User position
      } // If cartTotal
    },

    handleNeedLogin() {
      this.toggle_modal_state({ name: "authentication", value: true });
    },

    handleClickCardSubscription: function(user) {
      var self = this;
      if (process.env.NODE_ENV === "production") {
        var return_url =
          "https://acomerapp.cl" +
          self.$route.fullPath +
          '?pre_reserva="true"&cli_id=' +
          this.user_client.id;
      } else {
        var return_url =
          "http://localhost:4000" +
          self.$route.fullPath +
          '?pre_reserva="true"&cli_id=' +
          this.user_client.id;
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
    }
  },
  filters: {
    numFormat: function(value) {
      return value.toLocaleString();
    }
  },
  created: function() {
    var self = this;
    // Falta validar que sea solo reserva

    // Si es que viene de un callback de transaccion
    if (this.$route.query.transaction_id) {
      qvoApi
        .get("/transactions/" + this.$route.query.transaction_id)
        .then(function(response) {
          if (response.data.gateway_response.status == "success") {
            adminApi
              .get(
                `/reserve/show.json?transaction_id=${self.$route.query.transaction_id}`
              )
              .then(function(response) {
                self.$modal.show(
                  {
                    template: `
                <div class="reservation_result">
                  <h1>¡Tu reserva se realizó correctamente!</h1>
                  <h2>Puedes validar tu reserva con el siguiente codigo</h2>
                  <img :src="qr" />
                  <div class="field">
                    <label>Codigo de reserva</label>
                    <h3>{{code}}</h3>
                  </div>
                  <div class="field">
                    <label>fecha de reserva</label>
                    <h3>{{day}}</h3>
                  </div>
                  <div class="field">
                    <label>hora de reserva</label>
                    <h3>{{hour}}</h3>
                  </div>
                  <div class="field">
                    <label>Nro de persona</label>
                    <h3>{{people}}</h3>
                  </div>
                </div>
              `,
                    props: ["qr", "day", "code", "hour", "people"]
                  },
                  {
                    qr: response.data.qr,
                    day: response.data.reservation_day,
                    hour: response.data.reservation_hour,
                    code: response.data.id,
                    people: response.data.number_people
                  },
                  {
                    "before-close": event => {
                      this.reservationHour;
                    }
                  }
                );
              });
          } else {
            // Si el estado del pago no es sucess
            self.$swal({
              title: "Hubo un error con tu pago",
              text: response.data.gateway_response.message,
              type: "error"
            });
          }
          // Acá se debe actualizar el estado de la orden
          adminApi.post("/orders/transaction_edit", {
            transaction_id: self.$route.query.transaction_id,
            status: response.data.gateway_response.status,
            payment_method: response.data.gateway,
            payed:
              response.data.gateway_response.status == "success" ? true : false
          });
        });
    }

    // Si es que viene de una inscripcion de tarjeta al momento de pagar
    if (
      this.$route.query.pre_reserva &&
      this.$route.query.uid &&
      this.$route.query.cli_id
    ) {
      qvoApi
        .get(
          `/customers/${this.$route.query.cli_id}/cards/inscriptions/${this.$route.query.uid}`
        )
        .then(function(response) {
          // Re toma reserva o pago desde acà
        })
        .catch(function(response) {});
    }
  },
  components: {
    AcomerModalReserve,
    AcomerModalOrder,
    Modal,
    LoadingTransaction
  }
};
</script>

<style lang="scss" scoped>
.form-numero-de-mesa {
  width: 100%;
  float: left;
  margin-bottom: 20px;
}
.cart {
  background: rgba(33, 33, 33, 0.44);
  height: 100vh;
  width: 100%;
  position: fixed;
  z-index: 4;
}
.order {
  position: fixed;
  width: 50%;
  max-height: 400px;
  left: 25%;
  z-index: 6;
  height: auto;
  border-radius: 10px;
  padding: 15px;
  top: 200px;
  background: white;
  @media (max-width: 600px) {
    top: initial;
    left: initial;
    bottom: 78px;
    width: 100%;
    padding: 10px 12.5px 15px;
    border-radius: 10px 10px 0 0;
  }
  .close_icon {
    text-align: right;
  }
  .subtitle {
    @media (max-width: 480px) {
      padding: 10px 0 15px;
      margin-bottom: 0px !important;
      font-size: 19px;
      font-weight: 600;
    }
  }
}
.orderBar {
  width: 20%;
  text-align: center;
  padding: 9px 0;
  position: fixed;
  top: 40px;
  right: 0;
  cursor: pointer;
  z-index: 5;
  background: #fbe700;
  border-radius: 0px 0px 0px 5px;
  @media screen and(max-width:769px) {
    width: 30%;
  }
  @media screen and(max-width:600px) {
    width: 100%;
    top: initial;
    bottom: 40px;
    border-radius: 5px 5px 0 0;
  }
  h5 {
    font-size: 14px;
    color: #545454;
    font-weight: 600;
    svg {
      color: #545454;
      margin-right: 5px;
    }
  }
}
.product_image {
  width: 21%;
  float: left;
  margin-right: 3%;
  border-radius: 5px;
  img {
    height: auto;
    max-width: 150px;
    width: 100%;
    border-radius: 5px;
  }
}
.product_actions,
.product_info {
  width: 37.5%;
  float: left;
  padding: 2px 4px;
  overflow: hidden;
  h6 {
    width: 100%;
    float: left;
    white-space: nowrap;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    width: 100%;
    white-space: nowrap;
    float: left;
    font-size: 14px;
  }
}
.product_actions {
  text-align: center;
  padding: 12px 0;
  button {
    background: #fbe700;
    border: honeydew;
    width: 25px;
    font-weight: 800;
    border-radius: 3px;
    padding-bottom: 5px;
    line-height: 1;
    text-align: center;
    font-size: 17px;
  }
}
.products {
  max-height: 190px;
  float: left;
  height: auto;
  overflow-y: scroll;
}
.product {
  width: 100%;
  float: left;
  overflow: hidden;
  height: 50px;
  margin: 0 0 10px;
}

.cartActions {
  button {
    width: 40%;
    margin: 7.5px 5% 0;
    float: left;
    @media (max-width: 500px) {
      width: 50%;
      margin: 7.5px 25% 0;
      float: left;
    }
    @media (max-width: 400px) {
      width: 46%;
      margin: 7.5px 2% 0;
      float: left;
      font-size: 12.8px;

      &:nth-child(odd) {
        width: 48%;
        margin: 7.5px 1% 0 0;
      }
      &:nth-child(even) {
        width: 48%;
        margin: 7.5px 0 0 1%;
      }
      svg {
        width: 100%;
      }
    }

    @media (max-width: 400px) {
      font-size: 12.5px;
    }
  }
}
.aditional_comentary {
  float: left;
  width: 100%;
  label {
    font-size: 0.97rem;
  }
  input {
    width: 100%;
  }
}
</style>