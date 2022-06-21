const value = {
  description: null,
  maxProperties: null,
  minProperties: null
}
const attr = {
  description: {
    name: '描述',
    type: 'string',
  },
  maxProperties: {
    name: '最大元素个数',
    type: 'integer'
  },
  minProperties: {
    name: '最小元素个数',
    type: 'integer'
  },
  patternProperties: {
    name: '正则表达式属性对象',
    type: "object"
  },
  additionalProperties: {
    name: '其他属性对象',
    type: "object"
  },
  dependencies: {
    name: "依赖关系",
    type: "object"
  },
  "$ref": {
    name: "引用",
    type: "string"
  },
  if: {},
  then: {},
  else: {}
}
const wrapper = { value, attr }
export default wrapper