const { getSongSheetDetailApi } = require('../../api/api.js');
const musicHandler = require('../../behaviors/musicHandler.js');
const app = getApp();
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
      type: 'play',
      text: '下一首播放',
      src: '../../static/icons/recent_play/next.png' // icon的路径
    }, {
      type: 'like',
      text: '普通',
      extClass: 'test',
      src: '../../static/icons/recent_play/like.png' // icon的路径
    }],
    ifMultiSelect: false
  },
  onLoad(option) {
    const {
      id
    } = option;
    id && this.getSongSheetDetail(id);
  },
  onShow() {
    this.setData({
      musicInfo: {
        coverImgUrl: app.globalData.musicPlayer.coverImgUrl,
        id: app.globalData.musicPlayer.id,
        songName: app.globalData.musicPlayer.songName,
        singer: app.globalData.musicPlayer.singer,
        status: app.globalData.musicPlayer.status
      }
    })
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
  },
  playMusic() {
    this.setData({
      musicInfo: {
        coverImgUrl: app.globalData.musicPlayer.coverImgUrl,
        id: app.globalData.musicPlayer.id,
        songName: app.globalData.musicPlayer.songName,
        singer: app.globalData.musicPlayer.singer,
        status: app.globalData.musicPlayer.status
      }
    }, function() {
      app.globalData.musicPlayer.lyric = {
        currentIndex: 0,
        list: [],
        offsetTop: 0
      }
      wx.navigateTo({
        url: `/pages/player/player?id=${app.globalData.musicPlayer.id}`
      })
    })
  },
})