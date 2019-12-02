Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    list: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        newVal.length && this.observerHander(newVal);
      }
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
    isPlay: true // 歌曲是否正在播放标志
  },
  methods: {
    /**
     * 列表数据变更处理函数
     * @param {*} newVal 
     */
    observerHander(newVal) {
      console.log("newVal", newVal);
    },
    /**
     * 切换音乐播放状态
     */
    changePlayStatus() {
      this.setData({
        isPlay: !this.data.isPlay
      })
    }
  }
})