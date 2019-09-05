<template>
  <Modal class="modal_standard" :show="showModal" @close-modal="toggle_modal_state({name:'call_waiter', value: false})">
    <template v-if="branchData.has_tables != false">
      <h1>Envía una solicitud al mesero</h1>
      <div class="form-numero-de-mesa">
        <div class="field" v-if="tables.length > 0">
          <label>¿En que mesa te encuentras?</label>
          <select v-model="table_id">
            <option v-for="table in tables" :key="table.id" :value="table.id">
              <!-- Deberia mostrar el numero de mesa -->
              {{table.id}} {{table.description}}
            </option>
          </select>
          <label>¿Que necesitas?</label>
          <select v-model="reason">
            <option disabled value=""> Por favor seleccione su motivo: </option>
            <option> Pedir la cuenta </option>
            <option> Pedir mas </option>
            <option> Tengo un problema </option>
          </select>
        </div>
        <div class="field" v-else>
          <!-- Loader gif -->
          <div class="loader"></div>
          <p>Estamos cargando tus mesas</p>
        </div>
      </div>
      <div class="action">
        <button @click="callForWaiter2" v-if="table_id" class="acomer-button"> Llamar mesero <font-awesome-icon :icon="['fas', 'concierge-bell']" /></button>
      </div>
    </template>
    <template v-if="branchData.has_tables == false">
      <h1>No tiene mesas</h1>
      <div class="action">
        <button @click="callForWaiter2" v-if="table_id" class="acomer-button"> Llamar mesero <font-awesome-icon :icon="['fas', 'concierge-bell']" /></button>
      </div>
    </template>
  </Modal>
</template>

<script>
  import { mapActions, mapState} from 'vuex'
  import api from '~/components/services/acomer-services.js'
  import adminApi from '~/components/services/acomer-admin-services.js'
  import Modal from '~/components/modals/Modal.vue'

  export default {
    name: 'AcomerModalTable',
    props: ['showModal'],
    data(){
      return{
        tables: [],
        table_id: '',
        reason: ''
      }
    },
    computed: {
      ...mapState(['menuId','branchData']),
    },
    methods: {
      ...mapActions(['toggle_modal_state']),
      validateTableId: function() {
        this.$toast.show(
          'Debes ingresar un número de mesa', {
            type: 'error',
            duration: 1500
          }
        )
      },
      callForWaiter2: function(){
        self = this
        adminApi.post('/waiter_state/create.json', {
          reason: this.reason,
          table_id: this.table_id
        })
        .then(function(response){
          self.$swal({
            title:'Mensaje enviado correctamente', 
            text: 'Un mesero se encuentra en camino',
            type: 'sucess'
          })
          self.toggle_modal_state({name:'call_waiter', value: false})
        })
      }
    },
    components: {
      Modal
    },
    watch: {
      showModal: function(){
        var self = this
        api.get('/api/tables/branch/'+this.branchData.branch_id)
        .then(function (response) {
          self.tables = response.data
        })

      }
    }
  }
</script>

<style lang="scss" scoped>
  select{
    width: 100%;
    margin: 10px 0;
    border-radius: 5px;
    border: solid 1px #ccc;
    background: #ffffff;
    text-align: center;
    padding: 3px 0px;
  }
  label{
    font-size: 16px;
    @media(max-width: 360px){
      width: 100%;
      font-weight: 400;
      font-size: 13px;
    }
  }
  input{
    width: 100%;
    border: 1px solid #a2a2a2;
    border-radius: 3px;
    text-align: center;
  }

  .fecha-reserva-pedido{
    float: left;
    width: 100%;
    margin-top: 16px;
    margin-bottom: 16px;
    .field, input{
      width: 100%;
    }
  }
  .fecha-pedido {
    float: left;
    width: 100%;
    margin-top: 16px;
    margin-bottom: 16px;
    .field{
      width: 48%;
      float: left;
      margin: 0 1%;
      input {
        width: 100%;
      }
    }
  }
  .action{
    margin-bottom: 20px;
    button{
      width: 100%;
      // text-transform: uppercase;
      font-weight: 600;
      font-size: 16px;
    }
  }


  .modalidad-pedido{
    float: left;
    width: 100%;
    label {
      width: 48%!important;
      float: left;
      margin: 0 1%;
      text-align: center;
    }
  }

  button:disabled {
    background: #ccc;
  }
</style>