<script>
import {mapActions} from 'vuex'

export default {
  name: 'Modal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  render() {
    return (this.show) ? <div class="acomer_modal-wrapper">
      <div class="acomer_modal">
        <div class="acomer-modal-head text-right pb-2">
          <a onClick={this.onClose}>
          ❌
          </a>
        </div>
        <div class="acomer-modal-content">
          {this.$slots.default}
        </div>
      </div>
    </div> : null
  },
  methods: {
    onClose() {
      this.$emit('close-modal')
    }
  },
}
</script>
<style lang="scss">
.acomer-modal-head{
  width: 100%;
  float: right;
  margin-bottom: 0px;
  z-index: 9;
  a{
    float: right;
    cursor: pointer;
  }
}
.acomer_modal {
  width: 60%;
  top: 140px;
  left: 20%;
  height: auto;
  z-index: 2000;
  background: white;
  padding: 5px 15px 10px;
  border-radius: 5px;
  position: fixed;
  @media(max-width: 480px) {
    width: 90%;
    left: 4%;
  }
  h1{
    margin: 20px 0;
    font-size: 18px;
    text-align: center;
    @media(max-width: 360px) {
      margin: 15px 0;
      font-size: 16px;
      text-align: center;
    }
  }
  .action{
    margin-bottom: 20px;
    button{
      width: 100%;
      font-weight: 600;
      font-size: 14.5px;
      @media (max-width: 360px) {
        font-size: 14px;
      }
      img{
        max-width: 60px;
        margin: 0 80px;
      }
    }
  }
  footer{
    a{
      color: #fbe700;
    }
  }
}
.acomer-modal-content {
  float:left;
  width: 100%;
}
.acomer_modal > .modal-head {
  /* @apply relative; */
  position: relative;
}
 .acomer_modal-wrapper::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  height: 100%;
  background: rgba(37, 37, 37, 0.8);
}
</style>