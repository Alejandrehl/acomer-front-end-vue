<template>
  <div class="acomer_modal">
    <h1>{{title}}</h1>
</template>

<script>
  export default {
    name: 'AcomerModal',
    props: ['title']
  }
</script>

<style lang="scss" scoped>
  .acomer_modal{
    background: white;
    position: fixed;
    z-index: 100;
    top: 10%;
    padding: 15px;
    width: 80%;
    left: 10%;
    h1{
      font-size: 18px;
    }
  }
</style>