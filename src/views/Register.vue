<template>
    <div class="register-container">
        <img class="logo" :src="logoUrl" alt="GitLab Logo" />
        <span class="title">VFlow</span>
        <span class="tips">用户名</span>
        <el-input class="input-field" v-model="username" type="text" placeholder="用户名*" clearable />
        <span class="tips">密码（不得少于5位）</span>
        <el-input class="input-field" v-model="password" type="password" placeholder="密码*" clearable show-password />
        <span class="tips">请重复密码</span>
        <el-input class="input-field" v-model="repeatPassword" type="password" placeholder="密码*" clearable
            show-password />
        <button @click="registerHandler" class="register-button">注册</button>

        <div class="tool-container">
            <el-link class="login-link" :underline="false" @click="loginHandler">已有帐号？登录</el-link>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { register } from '../service/UserService'

const router = useRouter()
const logoUrl = import.meta.env.BASE_URL + 'favicon.ico';
const username = ref('');
const password = ref('');
const repeatPassword = ref('')

// 正则表达式匹配英文字母大小写、下划线、星号
const validPattern = /^[a-zA-Z_*]+$/

function registerHandler() {
    if (username.value == '' || password.value == '') {
        ElMessage({
            message: '用户名或密码不能为空',
            type: 'warning',
        })
        return
    }

    if (!validPattern.test(username.value) || !validPattern.test(password.value)) {
        ElMessage({
            message: '用户名和密码只能由英文字母大小写、下划线（_）、星号（*）组成',
            type: 'warning',
        })
        return
    }

    if (password.value != '' && password.value != repeatPassword.value) {
        ElMessage({
            message: '两次输入密码不一致',
            type: 'warning',
        })
        return
    }

    if (password.value.length < 5) {
        ElMessage({
            message: '密码长度需大于五位',
            type: 'warning',
        })
        return
    }

    ElMessage({
        message: '注册中...',
        type: 'success',
    })

    register({
        username: username.value,
        password: password.value,
    })
        .then((res) => {
            ElMessage({
                message: '注册成功',
                type: 'success',
            })
            router.push('/login')
        })
        .catch((err) => {
            ElMessage({
                message: err.response.data,
                type: 'warning',
            })
        })
}

function loginHandler() {
    router.push('/login')
}
</script>

<style scoped>
.register-container {
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
    margin-bottom: 40px;
    color: #363636;
}

.tips {
    width: 300px;
    margin-left: 10px;
    margin-bottom: 5px;
    text-align: left;
    font-size: 13px;
    font-weight: bold;
    color: #363636;

}

.input-field {
    width: 300px;
    height: 40px;
    font-size: 16px;
    margin-bottom: 25px;
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

.login-link {
    margin-right: 0px;
    margin-left: auto;
    color: #337ecc;
}

.login-link:hover {
    color: #0056b3;
}

.register-button {
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

.register-button:hover {
    background-color: #0056b3;
}
</style>