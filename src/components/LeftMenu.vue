<script setup>
  import {useRouter} from "vue-router";

  const user = JSON.parse(localStorage.getItem('user'))
  let role = 0
  if(user){
    role = user.role
  }

  const router = useRouter()

  function goTo(path){
    router.push(path)
  }

</script>

<template>
  <div class="LeftMenu">
    <div  @click="goTo('/')">个人信息</div>
    <div v-if="role === 1 || role === 2" @click="goTo('/insert')">提交检测</div>
    <div v-if="role === 2 || role === 2"  @click="goTo('/detection')">检测记录</div>
    <div v-if="role === 2" @click="goTo('/report')">查看报告</div>
    <div v-if="role === 2" @click="goTo('/ExportReport')">调取记录</div>
  </div>
</template>

<style scoped>
  .LeftMenu{
    width: 15%;
    float: left;
    height: 100vh;
    position: fixed;
    background: royalblue;
    color: white;
    border: 1px solid royalblue;
  }
  .LeftMenu>div{
    font-size: 20px;
    font-weight: bolder;
    width: 99%;
    margin: auto;
    text-align: center;
    margin-top: 30px;
  }
  .LeftMenu>div:hover{
    background: white;
    color: royalblue;
  }
</style>