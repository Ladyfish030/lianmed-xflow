<template>
  <div class="login-container">
    <img class="logo" :src="logoUrl" alt="GitLab Logo" />
    <span class="title">VFlow</span>
    <el-input
      class="input-field"
      v-model="username"
      type="text"
      placeholder="用户名*"
      clearable
      @keydown.enter="loginHandler"
    />
    <el-input
      class="input-field"
      v-model="password"
      type="password"
      placeholder="密码*"
      clearable
      show-password
      @keydown.enter="loginHandler"
    />
    <div class="tool-container">
      <el-checkbox v-model="rememberPwd" label="记住密码" size="large" />
      <el-link class="register-link" :underline="false" @click="registerHandler"
        >没有账号？点击注册</el-link
      >
    </div>
    <button @click="loginHandler" class="login-button">登录</button>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { encryptText, decryptText } from '../utils/encrypt'
import { login } from '../service/UserService'

const router = useRouter()
const logoUrl = import.meta.env.BASE_URL + 'favicon.ico'
const username = ref('')
const password = ref('')
const rememberPwd = ref(false)

onBeforeMount(() => {
  if (localStorage.getItem('username') && localStorage.getItem('password')) {
    username.value = decryptText(localStorage.getItem('username'))
    password.value = decryptText(localStorage.getItem('password'))
  }
  if (localStorage.getItem('rememberPwd')) {
    rememberPwd.value = JSON.parse(localStorage.getItem('rememberPwd'))
  }
})

function loginHandler() {
  localStorage.removeItem('token')
  if (username.value == '' || password.value == '') {
    ElMessage({
      message: '用户名或密码不能为空',
      type: 'warning',
    })
    return
  }
  ElMessage({
    message: '登录中...',
    type: 'warning',
  })
  if (rememberPwd.value) {
    localStorage.setItem('rememberPwd', rememberPwd.value)
    localStorage.setItem('username', encryptText(username.value))
    localStorage.setItem('password', encryptText(password.value))
  } else {
    localStorage.removeItem('username')
    localStorage.removeItem('password')
  }

  login({ username: username.value, password: password.value })
    .then((res) => {
      ElMessage({
        message: '登录成功',
        type: 'success',
      })
      sessionStorage.setItem('login', true)
      localStorage.setItem('token', res)
      router.push('/home')
    })
    .catch((err) => {
      if (err.response) {
        ElMessage({
          message: err.response.data,
          type: 'warning',
        })
      } else {
        ElMessage({
          message: '登录失败，请联系管理员',
          type: 'warning',
        })
      }
    })
}

function registerHandler() {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.logo {
  width: 50px;
  height: 50px;
}

.title {
  font-size: 25px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #363636;
}

.input-field {
  width: 300px;
  height: 40px;
  margin-top: 20px;
  font-size: 16px;
}

.tool-container {
  width: 300px;
  margin-top: 5px;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.register-link {
  margin-right: 0px;
  margin-left: auto;
  color: #337ecc;
}

.register-link:hover {
  color: #0056b3;
}

.login-button {
  width: 300px;
  height: 40px;
  margin-top: 40px;
  background-color: #337ecc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>
