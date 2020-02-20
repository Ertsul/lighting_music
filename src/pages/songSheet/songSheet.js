const { getSongSheetDetailApi } = require('../../api/api.js');

Page({
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
    }
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
      this.setData(pageData, function() {
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