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
    attached: function() {
      console.log("slideButtons", this.data.slideButtons);
      
      // this.setData({
      //   slideButtons: [{
      //     text: '普通',
      //     src: 'http://134.175.150.88:4001/icons/recent_play/multi_select.png', // icon的路径
      //   }, {
      //     text: '普通',
      //     extClass: 'test',
      //     src: 'http://134.175.150.88:4001/icons/recent_play/multi_select.png', // icon的路径
      //   }, {
      //     type: 'warn',
      //     text: '警示',
      //     extClass: 'test',
      //     src: 'http://134.175.150.88:4001/icons/recent_play/multi_select.png', // icon的路径
      //   }],
      // });
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    scrollHandle() {
      const scrollTarget = this.data.scrollTarget === 'scroll-item-1' ? 'scroll-item-2' : 'scroll-item-1';
      this.setData({
        scrollTarget
      })
    },
    changeHandle(e) {
      console.log("changeHandle", e.detail);

    },
    transitionHandle(e) {
      console.log("transitionHandle", e.detail);
      const {
        dx, dy
      } = e.detail;
      if (dy == 0 && dx == 100) {
        this.setData({
          nextMargin: "100rpx"
        })
      }
      if (dx > 100) {
        return
      }
    }
  },
})