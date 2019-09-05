<template>
  <section class="hero">
    <div v-if="status = 'successful'" class="hero-body">
      <h1 class="title">¡Pedido reservado correctamente!</h1>
      <h2>Monto: ${{payment.amount}}</h2>
    </div>
    <div v-if="status != 'successful'">
      <h1>¡Pago exitoso! {{id_transaccion }}</h1>
      <h2>${{payment.amount}}</h2>
    </div>
  </section>
</template>

<script>
import {qvoService, qvoApi} from '~/components/services/qvo-services'

export default {
  data(){
    return{
      id_transaccion: this.$route.query.transaction_id,
      payment: {}
    }
  },
  created() {
    var self = this
    qvoApi.get('/transactions/'+this.id_transaccion)  
    .then(function(response) {
      self.payment = response.data
    });

  }
}
</script>

<style lang="scss" scoped>

</style>
