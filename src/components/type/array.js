const value = {
  description: null,
  minItems: null,
  maxItems: null,
  uniqueItems: false
}
const attr = {
  description: {
    name: '描述',
    type: 'string'
  },
  // items
  items: {
    name: "元素",
    type: ["object", "array"]
  },
  maxItems: {
    name: '最大元素个数',
    type: 'integer'
  },
  minItems: {
    name: '最小元素个数',
    type: 'integer'
  },
  uniqueItems: {
    name: '元素不可重复',
    type: 'boolean'
  },
  additionalItems: {
    name: "其他元素",
    type: "object"
  },
  // contains
  contains: {

  },
  minContains: {

  },
  maxContains: {

  },
}
const wrapper = { value, attr }
export default wrapper