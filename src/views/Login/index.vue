<script setup>

</script>

<template>
  <div class="loginBackground">
    <RouterView/>
  </div>
</template>

<style scoped>
  .loginBackground{
    background-image: url("/Background.png");
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    padding-top: 90px;
  }
</style>