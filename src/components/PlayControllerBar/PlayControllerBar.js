const app = getApp();
const timeUpdate = require('../../behaviors/timeUpdate.js');
Component({
  behaviors: [timeUpdate],
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    list: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        newVal.length && this.observerHander(newVal);
      }
    },
    musicInfo: {
      type: Object,
      value: {},
    }
  },
  data: {
    someData: {},
    isPlay: true // 歌曲是否正在播放标志
  },
  lifetimes: {
    attached: function () {
      // this.timeUpdate();
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
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
      if (app.globalData.musicPlayer.status == 'off') {
        app.globalData.audioContext.play();
        const musicInfo = {
          ...this.data.musicInfo,
          status: 'on'
        }
        const vm = this;
        this.setData({
          musicInfo
        }, function() {
          vm.jumpPlayerPage();
        })
      } else {
        app.globalData.audioContext.pause();
        const musicInfo = {
          ...this.data.musicInfo,
          status: 'off'
        }
        this.setData({
          musicInfo
        })
      }
    },
    async jumpPlayerPage() {
      await console.log(app.globalData.audioContext.duration);
      wx.navigateTo({
        url: `/pages/player/player?id=${this.data.musicInfo.id}`
      })
    }
  }
})