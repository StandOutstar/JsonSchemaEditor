<template>
  <n-grid x-gap="4" :cols="17">
    <n-gi span="8">
      <n-grid :cols="8">
        <n-gi span="7">
          <div :style="{ paddingLeft: `${20 * deepth}px` }">
            <n-grid :cols="7">
              <n-gi span="1">
                <div class="downCollapse">
                  <n-button text v-on:click="hidden = !hidden">
                    <template #icon>
                      <n-icon size="20">
                        <caret-down v-if="hidden" />
                        <caret-forward v-else />
                      </n-icon>
                    </template>
                  </n-button>
                </div>
              </n-gi>
              <n-gi span="6">
                <div class="nameInput">
                  <n-input type="text" placeholder="node name" v-model:value="nodeInputName" @blur="onChangeName" />
                </div>
              </n-gi>
            </n-grid>
          </div>
        </n-gi>
        <n-gi span="1">
          <div class="checkbox">
            <n-space>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-checkbox size="large" @update:checked="onNodeCheckAll" :disabled="!nodeIsObject">
                  </n-checkbox>
                </template>
                <span>全选</span>
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-checkbox :checked="nodeChecked" size="large" @update:checked="onChildNodeCheck" :disabled="root">
                  </n-checkbox>
                </template>
                <span>必填</span>
                <!-- 对应 required -->
              </n-tooltip>
            </n-space>

          </div>
        </n-gi>
      </n-grid>
    </n-gi>
    <n-gi span="2">
      <div class="typeSelect">
        <n-select :options="typeOptions" v-model:value="nodeType" @update:value="onChangeType" />
      </div>
    </n-gi>
    <n-gi span="4">
      <div class="titleInput">
        <n-input type="text" placeholder="node title" v-model:value="nodeValue.title" />
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

  <template v-if="!hidden && nodeValue.properties && !nodeIsArray">
    <json-schema-editor v-for="(item, key, index) in nodeValue.properties" :value="{ [key]: item }" :parent="nodeValue"
      :key="key" :deepth="deepth + 1" :root="false" @update-key-required="handleChildNodeCheck"
      @update-name="handleInputName" />
  </template>
  <template v-if="nodeIsArray">
    <json-schema-editor :value="{ items: nodeValue.items }" :deepth="deepth + 1" disabled isItem :root="false" />
  </template>
</template>

<script lang="ts">
import { TYPE_NAME, TYPE } from './type/type'
import { isNull } from './util';
// import LocalProvider from './LocalProvider';
import { defineComponent, ref, toRefs, computed } from 'vue';
import { CaretDown, CaretForward, SettingsOutline, Add, Remove } from '@vicons/ionicons5'
import { NGrid, NGi, NButton, NInput, NCheckbox, NSelect, NIcon, NTooltip, NSpace } from 'naive-ui'

export default defineComponent({
  emits: ['updateKeyRequired', 'updateName'],
  components: {
    CaretDown, CaretForward, SettingsOutline, Add, Remove,
    NGrid, NGi, NButton, NInput, NCheckbox, NSelect, NIcon, NTooltip, NSpace
  },
  props: {
    value: { // nodeObject { "nodeName": {} //nodeValue }
      type: Object,
      required: true
    },
    nameEditDisabled: { //根节点name不可编辑,数组元素name不可编辑
      type: Boolean,
      default: false
    },
    typeSelectDisabled: { //禁用类型选择
      type: Boolean,
      default: false
    },
    isArrayItem: { //是否数组元素
      type: Boolean,
      default: false
    },
    deepth: { // 节点深度，根节点deepth=0
      type: Number,
      default: 0
    },
    root: { //是否root节点
      type: Boolean,
      default: true
    },
    parent: { //父节点
      type: Object,
      default: null
    },
  },
  setup(props) {
    let typeOptions = TYPE_NAME.map((value, index) => {
      return {
        label: value,
        value: value,
      }
    })

    let { value, parent } = toRefs(props)

    let nodeValue = Object.values(value.value)[0]

    const nodeIsObject = computed(() => {
      return nodeValue.type === 'object'
    })

    const nodeIsArray = computed(() => {
      return nodeValue.type === 'array'
    })

    let nodeName = Object.keys(props.value)[0]

    const nodeChecked = computed(() => {
      let checked = parent.value && parent.value.required && parent.value.required.indexOf(nodeName) >= 0
      if (checked) {
        return true
      } else {
        return false
      }
    })


    const nodeInputName = ref(nodeName)
    const nodeType = ref(nodeValue.type)
    return {
      typeOptions,
      nodeValue,
      nodeIsObject,
      nodeIsArray,
      nodeChecked,
      nodeName,
      nodeInputName,
      nodeType
    }
  },
  data() {
    return {
      TYPE_NAME,
      hidden: false,
    }
  },
  computed: {
  },
  methods: {
    // 通过事件的方式通知父组件更新
    onChildNodeCheck(checked) {
      this.$emit('updateKeyRequired', { checked: checked, key: this.nodeName })
    },
    handleChildNodeCheck(nodeCheck) {
      const { checked, key } = nodeCheck
      if (this.nodeValue.required === undefined) {
        this.nodeValue.required = []
      }
      const nameIndex = this.nodeValue.required.indexOf(key)
      if (checked) {
        if (nameIndex === -1) {
          this.nodeValue.required.push(key)
        }
      } else {
        if (nameIndex !== -1) {
          this.nodeValue.required.splice(nameIndex, 1)
        }
      }
    },
    onNodeCheckAll(checked) {
      if (this.nodeValue.type === 'object' && this.nodeValue.properties) {
        checked ? this.nodeValue.required = Object.keys(this.nodeValue.properties) : this.nodeValue.required = undefined

      } else if (this.nodeValue.type === 'array' && this.nodeValue.items.type === 'object') {
        checked ? this.nodeValue.items.required = Object.keys(this.nodeValue.items.properties) : this.nodeValue.items.required = undefined
        Object.keys(this.nodeValue.items.properties).forEach(key => this.onNodeCheckAll(checked, this.nodeValue.items.properties[key]))
      }
    },
    onChangeName() {
      if (this.nodeName == this.nodeInputName) return
      this.$emit('updateName', { oldKey: this.nodeName, newKey: this.nodeInputName })
    },
    handleInputName(namePair) {
      console.log('handle name input: ', namePair)
      const { oldKey, newKey } = namePair
      if (oldKey === newKey) {
        return
      }

      // 替换 key 名
      const nodeValue = this.nodeValue.properties[oldKey]
      this.nodeValue.properties[newKey] = nodeValue
      delete this.nodeValue.properties[oldKey]

      // 替换 required
      const requireds = this.nodeValue.required || []
      const oldIndex = requireds.indexOf(oldKey)
      if (requireds.length > 0 && oldIndex > -1) {
        requireds.splice(oldIndex, 1)
        requireds.push(newKey)
        Object.assign(this.nodeValue.required, requireds)
      }
    },
    onChangeType() {
      if (this.nodeValue.type === 'object') {
        delete this.nodeValue.properties
      }
      this.nodeValue.type = this.nodeType
    }
  }
})
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
  justify-content: flex-start;
  margin-left: 5px;
}


.container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>