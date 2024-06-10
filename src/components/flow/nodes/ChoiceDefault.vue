<template>
  <div class="component-container">
    <span class="span-text">Default</span>
    <el-divider class="divider" />
  </div>
</template>

<script setup>

</script>

<style scoped>
.component-container {
  border: 1px solid #b1b3b8;
  border-radius: 3px;
  background-color: white;
  position: relative;
  height: 100%;
}

.component-container:hover {
  background-color: #f4f4f5;
}

.span-text {
  position: absolute;
    top: 10px;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    font-size: 11px;
    color: black;
    line-height: 150%;
    width: 90%;
}

.divider {
  margin-top: 20px;
}
</style>