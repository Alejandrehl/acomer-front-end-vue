<template>
  <button 
    class="button is-link" 
    @click="$auth.loginWith('facebook')">
      <font-awesome-icon :icon="['fab', 'facebook-square']" /> 
      <label style="marginLeft: 10px;">Ingresar con Facebook</label>
  </button>
</template>
<script> 
export default {

}
</script>

