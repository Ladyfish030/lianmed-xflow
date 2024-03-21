<template>
  <div>
    <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
    >
      <div class="logo-div">
        <img :src="logoUrl" alt="Icon" class="logo"/>
        <span class="project-name-span">VFlow</span>
      </div>
    </el-menu>
  </div> 
</template>
<script lang="ts">
export default {
  name: 'BaseHeader',
}
</script>
<script lang="ts" setup>
import { ref } from 'vue'

const logoUrl = import.meta.env.BASE_URL + 'favicon.ico';
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.logo-div {
  width: 130px
}
.logo {
  width: 25px;
  height: 25px;
}
.el-menu-demo{
  width: 100%;
}
.flex-grow {
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
}
.project-name-span {
  width: 80px;
  font-size: 20px;
  margin-left: 10px;
}
</style>
