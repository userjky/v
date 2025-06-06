<script setup>
import { ref, computed } from 'vue'
import { login } from "@/apis/user.js";
import { useRouter } from "vue-router";

const id = ref('')
const password = ref('')
const router = useRouter()

const passwordError = computed(() => {
  return password.value.length > 0 && (password.value.length < 6 || password.value.length > 13)
})

async function quickLogin() {
  if (id.value && password.value && !passwordError.value) {
    const res = await login({
      id: id.value,
      password: password.value
    })
    localStorage.setItem('user', JSON.stringify(res.data))
    if (res.status >= 200 && res.status < 300) {
      await router.push('/')
    }
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="title">登录</div>
      <div class="form">
        <p>账号:<input type="text" placeholder="请输入用户id" v-model="id" required></p>
        <p>密码:<input type="password" placeholder="请输入密码" v-model="password" required></p>
        <p class="password-tip" v-if="passwordError">密码长度应在6到13位之间</p>
      </div>
      <div class="login-btn" @click="quickLogin"><span>登录</span></div>
      <RouterLink to="/login/register" class="link">→ 前往注册</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
}

.login-box {
  width: 350px;
  padding: 30px 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  letter-spacing: 5px;
}

.form {
  font-size: 18px;
}

.form p {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.form input {
  flex: 1;
  margin-left: 10px;
  height: 35px;
  font-size: 16px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.form input:focus {
  outline: none;
  border-color: #5b9df9;
}

.password-tip {
  color: red;
  font-size: 13px;
  margin-top: -10px;
  margin-bottom: 10px;
  margin-left: 65px;
}

.login-btn {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  cursor: pointer;
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  font-size: 20px;
  font-weight: bold;
  transition: transform 0.2s ease;
  margin-top: 10px;
}

.login-btn:hover {
  transform: scale(1.05);
}

.link {
  display: block;
  text-align: right;
  margin-top: 15px;
  font-size: 14px;
  color: #2575fc;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
