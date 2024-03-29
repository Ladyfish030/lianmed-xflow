<template>
    <div class="component-container">
      <Handle :position="Position.Top" />
      <Handle :position="Position.Bottom" />
      <h4 class="span-text">条件分支</h4>
    </div>
  </template>
  
  <script setup>
  import { Handle, Position } from '@vue-flow/core'
  </script>
  
  <style scoped>
  .component-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 50px;
    width: 50px;
    border: 1px solid black;
    border-radius: 5px;
    background-color: white;
  }
  
  .span-text {
    font-size: 10px;
    -webkit-box-align: center;
    -ms-flex-align: center;
  }
  </style>
  