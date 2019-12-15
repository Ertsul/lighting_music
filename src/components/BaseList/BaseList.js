const [RECENT_LIST, SEARCH_LIST] = [1, 2]; // 组件列表类型

Component({
  properties: {
    listType: { // 组件列表类型
      type: Number,
      value: RECENT_LIST
    },
    count: { // 列表数量
      type: Number,
      value: 0
    },
    lists: { // 列表
      type: Array,
      value: [{
        showRight: false
      }, {
        showRight: false
      }, {
        showRight: false
      }, {
        showRight: false
      }, {
        showRight: false
      }, {
        showRight: false
      }]
    }
  },
  data: {
    scrollX: true,
    scrollTarget: 'scroll-item-1',
    nextMargin: '0px',
    slideButtons: [{
      text: '下一首播放',
      src: 'http://134.175.150.88:4001/icons/recent_play/next.png', // icon的路径
    }, {
      text: '普通',
      extClass: 'test',
      src: 'http://134.175.150.88:4001/icons/recent_play/like.png', // icon的路径
    }, {
      type: 'warn',
      text: '警示',
      extClass: 'test',
      src: 'http://134.175.150.88:4001/icons/recent_play/delete.png', // icon的路径
    }],
  },
  lifetimes: {
    attached: function () {
      console.log("slideButtons", this.data.slideButtons);
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    /**
     * 只打开当前右滑块，关闭其他右滑块
     * @param {*} e 
     */
    scrollShowHandle(e) {
      const { index: currentIndex } = e.currentTarget.dataset;
      let lists = this.data.lists;
      lists = lists.map((item, index) => {
        item.showRight = currentIndex === index;
        return item;
      })
      this.setData({
        lists
      })
    },
    /**
     * 清空
     */
    clearAll() {
      wx.showModal({
        title: '',
        content: '清空所有最近播放歌曲？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
})