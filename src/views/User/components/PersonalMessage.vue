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
    personalMessage.value = res.data
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

      <!-- 修改密码按钮，定位右下角 -->
      <button class="togglePasswordBtn" @click="togglePasswordForm">
        {{ showPasswordForm ? "取消修改" : "修改密码" }}
      </button>

      <!-- 修改密码面板，显示时定位在按钮上方 -->
      <div v-if="showPasswordForm" class="passwordUpdateSection">
        <div class="infoRow"><span class="label">旧密码：</span><input v-model="oldPassword" type="password" /></div>
        <div class="infoRow"><span class="label">新密码：</span><input v-model="newPassword" type="password" /></div>
        <div v-if="newPassword.length > 0 && (newPassword.length < 6 || newPassword.length > 13)" class="error">
          密码长度应在6到13位之间
        </div>
        <div class="infoRow"><span class="label">确认新密码：</span><input v-model="confirmPassword" type="password" /></div>
        <div><button @click="onChangePassword" class="confirmBtn">确认修改</button></div>
      </div>

      <div class="retire" @click="retire">退出登录</div>
    </div>
  </div>
</template>

<style scoped>
/* 整体背景渐变加轻微纹理 */
.infoContainer {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding-top: 100px;
  box-sizing: border-box;

  background:
    /* 底层渐变色 */
    linear-gradient(135deg, rgb(255, 255, 255) 0%, #ACB6E5 100%),

    /* 叠加的四个斜线纹理图层 */
    linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%);

  background-size:
    auto,        /* 渐变铺满 */
    40px 40px,
    40px 40px,
    40px 40px,
    40px 40px;

  background-position:
    center center,
    0 0,
    0 20px,
    20px -20px,
    -20px 0;

  background-repeat:
    no-repeat,
    repeat,
    repeat,
    repeat,
    repeat;
}


/* 个人信息卡 */
.infoCard {
  width: 500px;
  padding: 40px 40px 80px; /* 下方留出空间给右下角按钮 */
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  text-align: left;
  position: relative; /* 为右下按钮定位 */
}

/* 标题 */
.cardTitle {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
  color: #333;
}

/* 信息行 */
.infoRow {
  font-size: 20px;
  margin-bottom: 20px;
}

/* 标签 */
.label {
  font-weight: bold;
  color: #666;
  display: inline-block;
  width: 80px;
}

/* 修改密码按钮：右下角固定 */
.togglePasswordBtn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: rgb(83, 74, 74);
  border: none;
  border-radius: 14px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}

.togglePasswordBtn:hover {
  background-color: #337ecc;
}

/* 修改密码区域，固定宽度，位于按钮上方 */
.passwordUpdateSection {
  position: absolute;
  bottom: 60px; /* 比按钮上方留点间距 */
  right: 20px;
  width: 320px;
  background: #f0f8ff;
  border: 1.5px solid;
  border-radius: 14px;
  padding: 20px 20px 15px;
  box-shadow: 0 8px 16px rgba(64, 158, 255, 0.25);
  font-size: 15px;
  z-index: 10;
}

/* 输入框 */
.passwordUpdateSection input[type="password"] {
  width: calc(100% - 90px);
  padding: 6px 10px;
  font-size: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  transition: border-color 0.3s;
}

.passwordUpdateSection input[type="password"]:focus {
  border-color: #409eff;
}

/* 输入行 */
.passwordUpdateSection .infoRow {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

/* 错误提示 */
.passwordUpdateSection .error {
  color: #e74c3c;
  margin-left: 80px;
  font-size: 13px;
  user-select: none;
}

/* 确认按钮 */
.confirmBtn {
  background-color: #409eff;
  border: none;
  color: white;
  padding: 8px 20px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  user-select: none;
  transition: background-color 0.3s ease;
}

.confirmBtn:hover {
  background-color: #337ecc;
}

/* 退出按钮 */
.retire {
  margin-top: 60px;
  cursor: pointer;
  background-color: #ff4d4f;
  color: white;
  padding: 12px 0;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 5px;
  text-align: center;
  user-select: none;
}

.retire:hover {
  background-color: #d9363e;
}

/* 未登录卡片样式不变 */
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
  user-select: none;
  transition: background-color 0.3s ease;
}

.goToLogin:hover {
  background-color: #337ecc;
}
</style>
