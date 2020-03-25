const [
  LIKE_LIST,
  RERENT_PLAY_LIST
] = [1, 2];
const app = getApp();

Page({
  data: {
    list: [],
    listType: LIKE_LIST,
    slideButtons: [{
      text: '下一首播放',
      src: '../../static/icons/recent_play/next.png' // icon的路径
    }, {
      text: '普通',
      extClass: 'test',
      src: '../../static/icons/recent_play/like.png' // icon的路径
    }, {
      type: 'warn',
      text: '警示',
      extClass: 'test',
      src: '../../static/icons/recent_play/delete.png' // icon的路径
    }]
  },
  onLoad(options) {
    const {
      type = LIKE_LIST
    } = options;
    this.setData({
      listType: type
    })
    console.log("type", type);
  },
  async onShow() {
    this.setData({
      list: this.data.listType == LIKE_LIST ? app.globalData.musicData.likeList : app.globalData.musicData.playList,
      slideButtons: this.data.listType == LIKE_LIST ? [{
        text: '下一首播放',
        src: '../../static/icons/recent_play/next.png' // icon的路径
      }, {
        type: 'warn',
        text: '警示',
        extClass: 'test',
        src: '../../static/icons/recent_play/delete.png' // icon的路径
      }] : [{
        text: '下一首播放',
        src: '../../static/icons/recent_play/next.png' // icon的路径
      }, {
        text: '普通',
        extClass: 'test',
        src: '../../static/icons/recent_play/like.png' // icon的路径
      }, {
        type: 'warn',
        text: '警示',
        extClass: 'test',
        src: '../../static/icons/recent_play/delete.png' // icon的路径
      }]
    })
  }
})