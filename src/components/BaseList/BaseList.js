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
    list: { // 列表
      type: Array,
      value: [],
    }
  },
  data: {
    ifSelectedAll: false, // 是否全选
    showCheckbox: false, // 是否显示 checkbox
    slideButtons: [{
      text: '下一首播放',
      src: '../../static/icons/recent_play/next.png', // icon的路径
    }, {
      text: '普通',
      extClass: 'test',
      src: '../../static/icons/recent_play/like.png', // icon的路径
    }, {
      type: 'warn',
      text: '警示',
      extClass: 'test',
      src: '../../static/icons/recent_play/delete.png', // icon的路径
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
      let list = this.data.list;
      list = list.map((item, index) => {
        item.showRight = currentIndex === index;
        return item;
      })
      this.setData({
        list
      })
    },
    /**
     * 隐藏所有的右滑快
     */
    hideAllRightSlide() {
      let list = this.data.list;
      list = list.map((item, index) => {
        item.showRight = false;
        return item;
      })
      this.setData({
        list
      })
    },
    /**
     * 清空列表
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
    },
    /**
     * 显示 checkbox
     */
    toggleCheckboxs() {
      let vmData = {};
      if (this.data.showCheckbox) { // 关闭时候，取消所有的选择
        let { list, ifSelectedAll } = this.data;
        list = list.map((item, index) => {
          item.checked = false;
          return item;
        })
        vmData = {
          list,
          ifSelectedAll: false
        }
      }
      vmData.showCheckbox = !this.data.showCheckbox;
      this.setData(vmData)
    },
    /**
     * 全选
     */
    selectAll(e) {
      console.log("e", e);
      let { list, ifSelectedAll } = this.data;
      list = list.map((item, index) => {
        item.checked = !ifSelectedAll;
        return item;
      })
      this.setData({
        list,
        ifSelectedAll: !ifSelectedAll
      })
    },
    checkboxChange(e) {
      console.log("checkboxChange", e);
    }
  },
})