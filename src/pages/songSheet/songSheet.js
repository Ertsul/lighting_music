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
    }]
  },
  onLoad(option) {
    this.timeUpdate();
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
    this.timeUpdate();
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
  timeUpdate() {
    app.globalData.audioContext.onTimeUpdate(() => {
      console.log("timeupdatetimeupdatetimeupdatetimeupdate");
      let obj = this.formatTime1(app.globalData.audioContext.currentTime);
      let str = `${obj.m}:${obj.s}`;
      let i = 0;
      for (i; i < app.globalData.musicPlayer.lyric.list.length; i++) {
        const item = app.globalData.musicPlayer.lyric.list[i];
        if (item.time.split('.')[0] == str) {
          console.log("app.globalData.musicPlayer.lyric.offsetTop", app.globalData.musicPlayer.lyric.offsetTop);
          if (app.globalData.musicPlayer.lyric.currentIndex != i) {
            const offsetTop = app.globalData.musicPlayer.lyric.offsetTop - (item.text.length > 42 ? (Math.round(item.text.length / 42)) * 70 : 70);
            const reg = /[\n]/gm;
            app.globalData.musicPlayer.lyric.offsetTop = offsetTop;
            app.globalData.musicPlayer.lyric.currentIndex = i;
            console.log("app.globalData.musicPlayer.lyric.offsetTop", app.globalData.musicPlayer.lyric.offsetTop);
            break
          }
        }
      }
    })
  },
  formatTime1(total) {
    let h = this.repairZero(Math.floor(total / 3600));
    let m = this.repairZero(Math.floor((total - h * 3600) / 60));
    let s = this.repairZero(Math.floor(total - h * 3600 - m * 60));
    return { h, m, s };
  },
  formatTime(time) {
    let min = Math.floor(time / 60);
    min = min < 10 ? `0${min}` : min;
    let second = (time % 60) * 10;
    second = second < 10 ? `0${second.toFixed(2)}` : second.toFixed(2);
    return `${min}:${second}` == "00:00" ? '' : `${min}:${second}`
  },
  repairZero(num) {
    return num < 10 ? '0' + num : num;
  }
})