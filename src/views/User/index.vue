<script setup>
import LeftMenu from "@/components/LeftMenu.vue";

</script>

<template>
  <div class="userPart">
    <LeftMenu class="leftMain"/>
    <RouterView class="rightMain"/>
  </div>
</template>

<style scoped>
.userPart {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.leftMain {
  width: 16%;
  min-width: 160px;
}

.rightMain {
  width: 84%;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
