<script setup>
import useDragAndDrop from '../hooks/useDnD'

const { onDragStart } = useDragAndDrop()
</script>

<template>
  <div class="flowside">
    <div class="description">组件库</div>

    <div class="nodes">
      <div :draggable="true" @dragstart="onDragStart($event, 'input')">
        Input Node
      </div>

      <div :draggable="true" @dragstart="onDragStart($event, 'default')">
        Default Node
      </div>

      <div :draggable="true" @dragstart="onDragStart($event, 'output')">
        Output Node
      </div>
    </div>
  </div>
</template>

<style scoped>
.description {
  line-height: 20px;
  height: 20px;
  font-weight: bold;
  font-size: 20px;
}
.nodes > div {
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
.flowside {
  background-color: rgb(139, 192, 139);
  padding: 20px;
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0 5px 10px #0000004d;
  border-radius: 6px;
  height: 100%;
}
</style>
