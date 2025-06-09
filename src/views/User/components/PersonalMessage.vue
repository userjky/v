<script setup>
import { useRouter } from "vue-router";
import { getUserInfo,updatePassword  } from "@/apis/user.js"; 
import { onMounted, ref } from "vue";

const user = JSON.parse(localStorage.getItem('user'))
const personalMessage = ref({})

const router = useRouter()

function goToLogin() {
  router.push('/login')
}

async function getPersonalMessage() {
  if (user) {
    const res = await getUserInfo()
    personalMessage.value = res
  }
}

function retire() {
  localStorage.removeItem('user')
  router.push('/login')
}

const oldPassword = ref("")
const newPassword = ref("")
const confirmPassword = ref("")

async function onChangePassword() {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    return alert("请填写完整的密码信息")
  }

  if (newPassword.value.length < 6 || newPassword.value.length > 13) {
    return alert("新密码长度应在6到13位之间")
  }

  if (newPassword.value !== confirmPassword.value) {
    return alert("两次新密码不一致")
  }

  try {
    const res = await updatePassword(oldPassword.value, newPassword.value)
    alert("密码修改成功，请重新登录")
    retire()
  } catch (e) {
    alert("密码修改失败：" + (e.response?.data || e.message))
  }
}

const showPasswordForm = ref(false)

function togglePasswordForm() {
  showPasswordForm.value = !showPasswordForm.value
}

onMounted(() => {
  getPersonalMessage()
})
</script>

<template>
  <div class="infoContainer">
    <div v-if="!user" class="unLoginCard">
      <div class="unLoginText">未登录</div>
      <div class="goToLogin" @click="goToLogin">前往登录</div>
    </div>

    <div v-else class="infoCard">
      <h2 class="cardTitle">个人信息</h2>
      <div class="infoRow"><span class="label">姓名：</span>{{ personalMessage.name }}</div>
      <div class="infoRow"><span class="label">用户id：</span>{{ personalMessage.id }}</div>
      <div class="infoRow"><span class="label">性别：</span>{{ personalMessage.gender ? "男" : "女" }}</div>
      <div class="infoRow">
        <span class="label">岗位：</span>
        <span v-if="user.role === 1">操作员</span>
        <span v-else-if="user.role === 2">质检员</span>
      </div>
      <div>
  <button @click="togglePasswordForm">修改密码</button>
<div v-if="showPasswordForm" class="passwordUpdateSection">
  <div class="infoRow"><span class="label">旧密码：</span><input v-model="oldPassword" type="password" /></div>
  <div class="infoRow"><span class="label">新密码：</span><input v-model="newPassword" type="password" /></div>
  <div v-if="newPassword.length > 0 && (newPassword.length < 6 || newPassword.length > 13)" style="color: red; margin-left: 80px;">
  密码长度应在6到13位之间
</div>
  <div class="infoRow"><span class="label">确认新密码：</span><input v-model="confirmPassword" type="password" /></div>
  <div><button @click="onChangePassword">确认修改</button></div>
</div>

</div>

      <div class="retire" @click="retire">退出登录</div>
    </div>
  </div>
</template>



<style scoped>
.infoContainer {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 100px;
}

.infoCard, .unLoginCard {
  width: 500px;
  padding: 40px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
  background-color: #f9f9f9;
}

.cardTitle {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
  color: #333;
}

.infoRow {
  font-size: 20px;
  margin-bottom: 20px;
  text-align: left;
}

.label {
  font-weight: bold;
  color: #666;
  display: inline-block;
  width: 80px;
}

.retire {
  margin-top: 40px;
  cursor: pointer;
  background-color: #ff4d4f;
  color: white;
  padding: 12px 0;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 5px;
}

.retire:hover {
  background-color: #d9363e;
}

.unLoginCard {
  width: 500px;
  padding: 40px;
  background-color: #fff7e6;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.unLoginText {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 40px;
  color: #333;
}

.goToLogin {
  background-color: #409eff;
  color: white;
  cursor: pointer;
  font-size: 24px;
  padding: 16px 0;
  border-radius: 10px;
  width: 60%;
  margin: auto;
  font-weight: bold;
  letter-spacing: 5px;
}

.goToLogin:hover {
  background-color: #337ecc;
}
</style>
