<script setup lang="ts">
import BaseHeader from '../components/BaseHeader.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
let loginChoose = ref(true)
let userName = ref('admin')
let password = ref('admin')
let passwordAgain = ref('admin')
function clickLogin() {
  loginChoose.value = true
}
function clickRegister() {
  loginChoose.value = false
}
function submit() {
  if (loginChoose.value) {
    router.push('/home')
  } else {
    if (password.value != passwordAgain.value) {
      ElMessage({
        message: '两次输入密码不一致',
        type: 'warning',
      })
    } else if (password.value.length < 5) {
      ElMessage({
        message: '密码长度需大于五位',
        type: 'warning',
      })
    }
  }
}
</script>

<template>
  <div class="bg-box">
    <el-header class="base-header">
      <base-header></base-header>
    </el-header>
    <div class="content-box">
      <div class="choose-box">
        <div
          class="login-button"
          :class="{ chosen: loginChoose }"
          @click="clickLogin"
        >
          登录
        </div>
        <div
          class="register-button"
          :class="{ chosen: !loginChoose }"
          @click="clickRegister"
        >
          注册
        </div>
      </div>
      <div class="input-box">
        <el-input
          class="username-input"
          v-model="userName"
          style="width: 240px"
          placeholder="账号"
        />
        <el-input
          class="password-input"
          v-model="password"
          style="width: 240px"
          type="password"
          placeholder="密码"
          show-password
        />
        <el-input
          class="password-input"
          v-model="passwordAgain"
          style="width: 240px"
          type="password"
          placeholder="请重复密码"
          show-password
          v-if="!loginChoose"
        />
      </div>
      <div class="submit-box" @click="submit">
        <svg
          t="1715098287119"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1463"
          width="256"
          height="256"
        >
          <path
            d="M512.113587 960.438359c-6.737448 0-13.475919-2.572592-18.618033-7.723915-10.29139-10.293437-10.29139-26.974351 0-37.265742l263.312034-263.572978c10.286274-10.296507 26.950815-10.296507 37.237089 0 10.29139 10.293437 10.29139 26.974351 0 37.268812L530.73469 952.715467C525.589506 957.865767 518.851035 960.438359 512.113587 960.438359zM933.441495 538.725688 90.788749 538.725688c-14.543228 0-26.336832-11.806907-26.336832-26.358321 0-14.558577 11.793604-26.360368 26.336832-26.360368l779.073708 0L493.495554 109.287055c-10.29139-10.296507-10.29139-26.974351 0-37.270858 10.286274-10.296507 26.950815-10.296507 37.239136 0l421.324838 421.715741c7.53665 7.538697 9.798157 18.868743 5.706979 28.725228C953.705004 532.299325 944.085926 538.725688 933.441495 538.725688z"
            fill="#272636"
            p-id="1464"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
.content-box {
  width: 300px;
  border: 2px solid black;
  border-radius: 20px;
  overflow: hidden;
}
.base-header {
  position: absolute;
  top: 0;
  left: 0;
}
.choose-box {
  height: 50px;
  line-height: 50px;
  display: flex;
  border-bottom: 2px solid black;
}
.login-button {
  border-right: 2px solid black;
}
.login-button,
.register-button {
  color: black;
  font-size: 16px;
  text-align: center;
  flex: 1;
  cursor: pointer;
}
.chosen {
  background-color: rgb(70, 70, 70);
  color: white;
  font-weight: bold;
}
.input-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.username-input,
.password-input {
  margin-top: 30px;
}
.submit-box {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  width: 100px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  margin: 30px auto;
  border: 1px black solid;
  border-radius: 20px;
}
.submit-box:hover {
  transform: scale(1.1);
}
.submit-box svg {
  width: 100%;
  height: 100%;
}
</style>
