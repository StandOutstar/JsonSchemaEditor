# json schema editor

容器样式
单个 editor 样式
单个 editor 数据，方法
如何递归 editor
[tree 数据如何外部访问](https://github.com/zyqwst/json-schema-editor-vue/blob/master/examples/App.vue)

## 参照

[vue json schema editor demo](https://github.com/zyqwst/json-schema-editor-vue/blob/master/packages/json-schema-editor/main.vue)
[json schema editor demo](http://json-schema-editor.sviip.com)
[yapi demo](http://yapi.smart-xwork.cn/doc/documents/mock.html#%E6%96%B9%E5%BC%8F2.-json-schema)

[json-schema specification](https://json-schema.org/specification-links.html#2020-12)
[json-schema understanding](http://json-schema.org/understanding-json-schema/index.html)

[navie-ui](https://www.naiveui.com/zh-CN/os-theme/components/space)
[vue3](https://v3.cn.vuejs.org/api/sfc-style.html#%E7%8A%B6%E6%80%81%E9%A9%B1%E5%8A%A8%E7%9A%84%E5%8A%A8%E6%80%81-css)

[json-schema generate form](https://zhuanlan.zhihu.com/p/171811326)

传给节点的数据

```json
{
  tree: {
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
        }
      },
      "required": [
        "name",
        "appId",
        "credate"
      ]
    }
  }
}
```

每个字段的数据结构都是:

```json
{
  "key": {
    "type": "",
    "title": "",
  }
}

```

每个节点的 pickValue 都是

```json
{
  "type": "",
  "title": "",
}
```

### 添加子节点的原理

点击添加按钮时，向该节点的子节点数据(properties)中增加子节点数据，自然就渲染出子节点的元素

## changelog

2022-06-20 15:31:58 添加需要的元素并完成基本布局。

## 问题

1. 解决树状数据更新子节点不更新

https://stackoverflow.com/questions/70481376/vue3-blocks-tree-does-not-reload-when-changing-the-data?rq=1

数据应该是 reactive 的，然后去修改。

其他数据不更新的情形：
https://blog.csdn.net/eagle89/article/details/124035016
