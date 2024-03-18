<script lang="ts" setup>
import { Background } from '@vue-flow/background'
</script>

<template>
  <div style="height: 100%; width: 100%">
    <Background :size="2" :gap="20" pattern-color="#BDBDBD">
      <slot />
    </Background>
  </div>
</template>
<style>
.vue-flow__node-default,
.vue-flow__node-input,
.vue-flow__node-output {
  width: 150px;
  line-height: 15px;
  padding: 15px;
  background-color: whitesmoke;
  border-radius: 8px;
  margin: 10px 0;
  cursor: grab;
  -webkit-box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.25);
  box-shadow: 5px 5px 10px 2px #00000040;
}
</style>
