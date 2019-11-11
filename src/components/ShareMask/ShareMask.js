Component({
  properties: {
    hidden: {
      type: Boolean,
      value: true,
      observer(newVal, oldVal) { }
    }
  },
  data: {
    ifShowShareCircle: false, // 是否显示小程序码卡片
  },
  methods: {
    /**
     * 关闭分享层
     */
    hideShareMask() {
      console.log(":::: hideShareMask");
      this.setData({
        hidden: !this.data.hidden
      })
    },
    /**
     * 分享
     * sharetype：1 --> 微信好友
     * sharetype：2 --> 朋友圈
     */
    shareHandler(e) {
      // console.log(":::: shareHandler", e.currentTarget.dataset.sharetype);
      const shareType = e.currentTarget.dataset.sharetype;
      if (shareType == 1) {

      } else {
        this.setData({
          ifShowShareCircle: true
        })
      }
    },
    /**
     * 关闭小程序码卡片
     */
    closeCircleShare() {
      this.setData({
        ifShowShareCircle: false
      })
    },
    /**
     * 空函数，阻止事件冒泡
     */
    catchtapHandler() { }
  }
})