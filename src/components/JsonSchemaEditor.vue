<template>
  <n-grid x-gap="4" :cols="17">
    <n-gi span="8">
      <n-grid :cols="8">
        <n-gi span="1">
          <div class="downCollapse">
            <n-button text>
              <template #icon>
                <n-icon size="20">
                  <caret-down v-if="checked" />
                  <caret-forward v-else />
                </n-icon>
              </template>
            </n-button>
          </div>
        </n-gi>
        <n-gi span="6">
          <div class="nameInput">
            <n-input type="text" placeholder="基本的 Input" />
          </div>
        </n-gi>
        <n-gi span="1">
          <div class="checkbox">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-checkbox v-model:checked="checked" size="large">
                </n-checkbox>
              </template>
              全选
            </n-tooltip>
          </div>
        </n-gi>
      </n-grid>
    </n-gi>
    <n-gi span="2">
      <div class="typeSelect">
        <n-select :options="options" />
      </div>
    </n-gi>
    <n-gi span="4">
      <div class="titleInput">
        <n-input type="text" placeholder="基本的 Input" />
      </div>
    </n-gi>
    <n-gi span="2">
      <div class="container">
        <n-space align="center" justify="space-around" size="large">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button text>
                <template #icon>
                  <n-icon size="20">
                    <settings-outline />
                  </n-icon>
                </template>
              </n-button>
            </template>
            高级设置
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button text>
                <template #icon>
                  <n-icon size="20">
                    <add />
                  </n-icon>
                </template>
              </n-button>
            </template>
            添加节点
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button text>
                <template #icon>
                  <n-icon size="20">
                    <remove />
                  </n-icon>
                </template>
              </n-button>
            </template>
            删除节点
          </n-tooltip>

        </n-space>

      </div>


    </n-gi>
  </n-grid>
</template>

<script setup>
import { CaretDown, CaretForward, SettingsOutline, Add, Remove } from '@vicons/ionicons5'
import { NGrid, NGi, NButton, NInput, NCheckbox, NSelect, NIcon, NTooltip, NSpace } from 'naive-ui'
import { ref } from 'vue'

const options = [
  {
    label: "Everybody's Got Something to Hide Except Me and My Monkey",
    value: 'song0',
    disabled: true
  },
  {
    label: 'Drive My Car',
    value: 'song1'
  },];

let checked = ref(false);
</script>

<style scoped>
.downCollapse {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: 5px;
}

.checkbox {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 5px;
}


.container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>