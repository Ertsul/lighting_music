Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    list: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        newVal.length && this.observerHander(newVal);
      }
    },
     type: { // type 为 0 是自建歌单，为 1 是收藏歌单
       type: Number,
       value: 0
     }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    /**
     * 列表数据变更处理函数
     * @param {*} newVal 
     */
    observerHander(newVal) {
      console.log("newVal", newVal);
    }
  }
})