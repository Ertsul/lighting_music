const { getSongSheetDetailApi } = require('../../api/api.js');
var musicHandler = require('../../behaviors/musicHandler.js')
Page({
  behaviors: [musicHandler],
  data: {
    songList: [],
    songSheetInfo: {
      coverImgUrl: '',
      description: '',
      playCount: 0
    },
    creator: {
      avatarUrl: '',
      nickname: ''
    },
    slideButtons: [{
      text: '下一首播放',
      src: '../../static/icons/recent_play/next.png' // icon的路径
    }, {
      text: '普通',
      extClass: 'test',
      src: '../../static/icons/recent_play/like.png' // icon的路径
    }]
  },
  onLoad(option) {
    const {
      id
    } = option;
    id && this.getSongSheetDetail(id);
  },
  async getSongSheetDetail(id) {
    try {
      wx.showLoading({
        title: '加载中'
      })
      const res = await getSongSheetDetailApi({
        id
      });
      const data = res.data.playlist;
      let pageData = {
        songSheetInfo: {
          coverImgUrl: data.coverImgUrl,
          description: data.description,
          playCount: data.playCount
        },
        creator: {
          avatarUrl: data.creator.avatarUrl,
          nickname: data.creator.nickname
        },
        songList: data.tracks
      };
      this.setData(pageData, function () {
        wx.hideLoading();
      });
    } catch (error) {
      console.error(error);
    }
  },
  navigateBack() {
    wx.navigateBack({
      delta: 1
    })
  }
})