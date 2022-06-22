<template>
  <n-grid x-gap="4" :cols="17">
    <n-gi span="8">
      <n-grid :cols="8">
        <n-gi span="7">
          <div class="nodeHead" :style="{ paddingLeft: `${20 * deepth}px` }">
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
                  <n-input type="text" placeholder="node name" v-model:value="nodeName" />
                </div>
              </n-gi>
            </n-grid>
          </div>
        </n-gi>
        <n-gi span="1">
          <div class="checkbox">
            <n-tooltip trigger="hover" v-if="root">
              <template #trigger>
                <n-checkbox size="large" @update:checked="onRootCheck">
                </n-checkbox>
              </template>
              <span>全选</span>
            </n-tooltip>
            <n-tooltip trigger="hover" v-else>
              <template #trigger>
                <n-checkbox :checked="checked" size="large" @update:checked="onCheck">
                </n-checkbox>
              </template>
              <span>必填</span>
              <!-- 对应 required -->
            </n-tooltip>
          </div>
        </n-gi>
      </n-grid>
    </n-gi>
    <n-gi span="2">
      <div class="typeSelect">
        <n-select :options="typeOptions" v-model:value="nodeValue.type" @update:value="onChangeType" />
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

  <template v-if="!hidden && nodeValue.properties && !isArray">
    <json-schema-editor v-for="(item, key, index) in nodeValue.properties" :value="{ [key]: item }" :parent="nodeValue"
      :key="index" :deepth="deepth + 1" :root="false" :lang="lang" :custom="custom" />
  </template>
  <template v-if="isArray">
    <json-schema-editor :value="{ items: nodeValue.items }" :deepth="deepth + 1" disabled isItem :root="false"
      :lang="lang" :custom="custom" />
  </template>
</template>

<script lang="ts">
import { TYPE_NAME, TYPE } from './type/type'
import { isNull } from './util';
import LocalProvider from './LocalProvider';
import { defineComponent, ref } from 'vue';
import { CaretDown, CaretForward, SettingsOutline, Add, Remove } from '@vicons/ionicons5'
import { NGrid, NGi, NButton, NInput, NCheckbox, NSelect, NIcon, NTooltip, NSpace } from 'naive-ui'

export default defineComponent({
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
    custom: { //enable custom properties
      type: Boolean,
      default: false
    },
    lang: { // i18n language
      type: String,
      default: 'zh_CN'
    }
  },
  setup(props) {
  },
  data() {
    return {
      TYPE_NAME,
      hidden: false,
      countAdd: 1,
      modalVisible: false,
      advancedValue: {},
      addProp: {},// 自定义属性
      customProps: [],
      customing: false,
      local: LocalProvider(this.lang),
      typeOptions: TYPE_NAME.map((value, index) => {
        return {
          label: value,
          value: value,
        }
      }),
      nodeValue: Object.values(this.value)[0],
      nodeName: Object.keys(this.value)[0],
    }
  },
  computed: {

    isObject() {
      return this.nodeValue.type === 'object'
    },
    isArray() {
      return this.nodeValue.type === 'array'
    },
    checked() {
      let checked = this.parent && this.parent.required && this.parent.required.indexOf(this.nodeName) >= 0
      console.log('node checked: ', this.parent, this.nodeValue, checked)
      return checked ? true : false
    },
    advanced() {
      return TYPE[this.nodeValue.type]
    },
    advancedAttr() {
      return TYPE[this.nodeValue.type].attr
    },
    advancedNotEmptyValue() {
      const jsonNode = Object.assign({}, this.advancedValue);
      for (let key in jsonNode) {
        isNull(jsonNode[key]) && delete jsonNode[key]
      }
      return jsonNode
    },
    completeNodeValue() {
      const t = {}
      for (const item of this.customProps) {
        t[item.key] = item.value
      }
      return Object.assign({}, this.nodeValue, this.advancedNotEmptyValue, t)
    }
  },
  methods: {
    parseCustomProps() {
      const ownProps = ['type', 'title', 'properties', 'items', ...Object.keys(this.advancedAttr)]
      Object.keys(this.nodeValue).forEach(key => {
        ownProps.indexOf(key) === -1 && this.confirmAddCustomNode({ key: key, value: this.nodeValue[key] })
      })
    },
    onInputName(e) {
      const oldKey = this.nodeName
      const newKey = e.target.value
      if (oldKey === newKey) return
      const nodeValue = this.parent.properties[oldKey]
      // 替换key名
      this.$delete(this.parent.properties, oldKey)
      this.$set(this.parent.properties, newKey, nodeValue)
      // required重新设置
      const requireds = this.parent.required || []
      const oldIndex = requireds.indexOf(oldKey)
      if (requireds.length > 0 && oldIndex > -1) {
        requireds.splice(oldIndex, 1)
        requireds.push(newKey)
        this.$set(this.parent, 'required', [...new Set(requireds)])
      }
    },
    onChangeType() {
      this.parseCustomProps()
      // 删除自定义属性
      this.customProps.forEach(item => {
        this.nodeValue[item.key] = undefined
        //this.$delete(this.nodeValue, item.key)
      })

      this.customProps = [];
      this.nodeValue.properties = undefined
      this.nodeValue.items = undefined
      this.nodeValue.required = undefined
      this.nodeValue.format = undefined
      this.nodeValue.enum = undefined
      // this.$delete(this.nodeValue, 'properties')
      // this.$delete(this.nodeValue, 'items')
      // this.$delete(this.nodeValue, 'required')
      // this.$delete(this.nodeValue, 'format')
      // this.$delete(this.nodeValue, 'enum')
      if (this.isArray) {
        //this.$set(this.nodeValue, 'items', { type: 'string' })
        this.nodeValue.items = { type: 'string' }
      }
    },
    changeEnumValue(e) {
      const pickType = this.nodeValue.type
      const value = e.target.value
      var arr = value.split('\n')
      if (arr.length === 0) return
      this.advancedValue.enum = arr.map(item => pickType === 'string' ? item : +item)
    },
    onCheck(checked: boolean) {
      this._checked(checked, this.parent)
    },
    onRootCheck(checked: boolean) {
      this._deepCheck(checked, this.nodeValue)
    },
    _deepCheck(checked: boolean, node) {
      if (node.type === 'object' && node.properties) {
        checked ? node.required = Object.keys(node.properties) : node.required = undefined
        Object.keys(node.properties).forEach(key => this._deepCheck(checked, node.properties[key]))

      } else if (node.type === 'array' && node.items.type === 'object') {
        checked ? node.items.required = Object.keys(node.items.properties) : node.items.required = undefined
        Object.keys(node.items.properties).forEach(key => this._deepCheck(checked, node.items.properties[key]))
      }
      console.log('deepcheck object node: ', checked, node)
    },
    _checked(checked, parent) {
      let required = parent.required
      if (checked) {
        required || Object.defineProperty(this.parent, 'required', {
          value: [],
          writable: true
        })
        required = this.parent.required

        required.indexOf(this.nodeName) === -1 && required.push(this.nodeName)
        console.log('parent required: ', required)
      } else {
        const pos = required.indexOf(this.nodeName)
        pos >= 0 && required.splice(pos, 1)
      }
      if (required.length === 0) {
        parent.required = undefined;
      }
    },
    addChild() {
      const name = this._joinName()
      const type = 'string'
      const node = this.nodeValue
      node.properties || this.$set(node, 'properties', {})
      const props = node.properties
      this.$set(props, name, { type: type })
    },
    addCustomNode() {
      this.$set(this.addProp, 'key', this._joinName())
      this.$set(this.addProp, 'value', '')
      this.customing = true
    },
    confirmAddCustomNode(prop) {
      const p = prop || this.addProp
      this.customProps.push(p)
      this.addProp = {}
      this.customing = false
    },
    removeNode() {
      const { properties, required } = this.parent
      this.$delete(properties, this.nodeName)
      if (required) {
        const pos = required.indexOf(this.nodeName)
        pos >= 0 && required.splice(pos, 1)
        required.length === 0 && this.$delete(this.parent, 'required')
      }
    },
    _joinName() {
      return `field_${this.deep}_${this.countAdd++}`
    },
    onSetting() {
      this.modalVisible = true
      this.advancedValue = { ...this.advanced.value }
      for (const k in this.advancedValue) {
        if (this.nodeValue[k]) this.advancedValue[k] = this.nodeValue[k]
      }
      this.parseCustomProps()
    },
    handleOk() {
      this.modalVisible = false
      for (const key in this.advancedValue) {
        if (isNull(this.advancedValue[key])) {
          this.$delete(this.nodeValue, key)
        } else {
          this.$set(this.nodeValue, key, this.advancedValue[key])
        }
      }
      for (const item of this.customProps) {
        this.$set(this.nodeValue, item.key, item.value)
      }
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

.nodeHead {}

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