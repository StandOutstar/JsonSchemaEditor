<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
import HellowNaive from './components/HellowNaive.vue';
import JsonSchemaEditor from './components/JsonSchemaEditor.vue'
import { reactive, watchEffect } from 'vue'

const tree = reactive({  // 关键在于源头没有使用 响应式
  "root": {
    "type": "object",
    "title": "条件",
    "properties": {
      "name": {
        "type": "string",
        "title": "名称",
        "maxLength": 10,
        "minLength": 2
      },
      "appId": {
        "type": "integer",
        "title": "应用ID"
      },
      "credate": {
        "type": "string",
        "title": "创建日期",
        "format": "date"
      },
      "embedObject": {
        "type": "object",
        "title": "embedObject",
        "properties": {
          "key": {
            "type": "string",
            "title": "key"
          }
        }
      }
    }
  }
})

watchEffect(() => console.log('update tree: ', tree))

</script>

<template>
  <div>
    <JsonSchemaEditor :value="tree" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
