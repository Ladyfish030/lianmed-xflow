<template>
  <el-dialog 
      v-model="xmlGeneratedResultVisible" 
      title="XML" 
      width="800" 
      top="10vh"
      :close-on-click-modal="false" 
      :append-to-body="true"
      @close="handleClose()"
      >
      <div class="xml-container">
          <div class="xml-scrollbar-container">
              <el-scrollbar>
                  <div class="xml-content-container">
                      <highlightjs language="xml" :code="props.data" />
                  </div>
              </el-scrollbar>
          </div>
      </div>

      <template #footer>
          <div>
              <el-button @click="copyToClipboard">复制</el-button>
              <el-button type="primary" @click="downloadXmlFile">下载</el-button>
          </div>
      </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: String
})

const emit = defineEmits(['close'])

const xmlGeneratedResultVisible = ref(true)

function handleClose() {
  emit('close')
}

function copyToClipboard() {
  navigator.clipboard
    .writeText(xmlData.value)
    .then(() => {
      ElMessage({
        message: '复制成功',
        type: 'success',
      })
    })
    .catch(() => {
      ElMessage({
        message: '复制失败',
        type: 'error',
      })
    })
}

function downloadXmlFile() {
  const blob = new Blob([xmlData.value], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mule_xml.xml'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.xml-container {
  width: 100%;
  height: 400px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.xml-scrollbar-container {
  width: 765px;
  height: 395px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.xml-content-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  height: 100%;
  text-align: left;
  font-family: 'Consolas';
  font-size: 14px;
  line-height: 1.5;
}
</style>