<script setup>
import { ref, computed } from 'vue'
import { register } from "@/apis/user.js"
import { useRouter } from "vue-router"

const name = ref('')
const password = ref('')
const gender = ref(true)
const role = ref('')

const router = useRouter()

const passwordError = computed(() => {
  return password.value.length > 0 && (password.value.length < 6 || password.value.length > 13)
})

async function registerUser() {
  if (name.value && password.value && role.value && !passwordError.value) {
    const data = {
      name: name.value,
      password: password.value,
      gender: gender.value,
      role: role.value
    }
    const res = await register(data)
    if (res.status >= 200 && res.status < 300) {
      alert("注册成功")
      await router.push('/login')
    }
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-title">注册</div>
      <div class="form">
        <p class="form-item">
          姓名:
          <input type="text" placeholder="用户名,可不填，将自动生成" v-model="name" required />
        </p>
        <p class="form-item">
          密码:
          <input type="password" placeholder="密码（6~13位）" v-model="password" required />
        </p>
        <p v-if="passwordError" class="password-error">密码长度应在6到13位之间</p>
        <p class="form-item gender">
          性别:
          <input type="radio" v-model="gender" :value="true" /> 男
          <input type="radio" v-model="gender" :value="false" /> 女
        </p>
        <p class="form-item">
          选择岗位:
          <select v-model="role">
            <option disabled value="">请选择角色</option>
            <option value="1">操作员</option>
            <option value="2">质检员</option>
          </select>
        </p>
      </div>
      <div class="register-button" @click="registerUser">
        <span>注册</span>
      </div>
      <RouterLink to="/login" class="link-to-login">→ 返回登录</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
}


.register-box {
  width: 400px;
  padding: 30px 25px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.register-title {
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

.form-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.form-item input[type="text"],
.form-item input[type="password"],
.form-item select {
  flex: 1;
  margin-left: 10px;
  height: 35px;
  font-size: 16px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.form-item input:focus,
.form-item select:focus {
  outline: none;
  border-color: #5b9df9;
}

.gender input {
  margin: 0 8px 0 16px;
}

.password-error {
  color: red;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
  margin-left: 85px;
}

.register-button {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  cursor: pointer;
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  font-size: 20px;
  font-weight: bold;
  transition: transform 0.2s ease;
  margin-top: 20px;
}

.register-button:hover {
  transform: scale(1.05);
}

.link-to-login {
  display: block;
  text-align: right;
  margin-top: 20px;
  font-size: 14px;
  color: #2575fc;
  text-decoration: none;
}

.link-to-login:hover {
  text-decoration: underline;
}
</style>
