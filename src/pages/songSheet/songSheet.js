const { getSongSheetDetailApi } = require('../../api/api.js');
const app = getApp();
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
  async onLoad(option) {
    try {
      const {
        id
      } = option;
      this.setData({ id });
      id && (await this.getSongSheetDetail(id));
    } catch (error) {
      console.error("songSheet onLoad error", error);
    }
  },
  async onShow() {
    let songList = this.data.songList;
    const id = getApp().globalData.musicPlayer.id;
    const likeList = getApp().globalData.musicData.likeList;
    for (let i = 0; i < songList.length; i++) {
      const item = songList[i];
      if (item.id == id) {
        // 当前播放标记
        songList[i].active = true;
      }
      for (let j = 0; j < likeList.length; j++) {
        // 喜欢列表标记
        if (likeList[j].id == item.id) {
          songList[i].like = true;
          songList[i].buttons = [{
            type: 'play',
            text: '下一首播放',
            src: '../../static/icons/recent_play/next.png' // icon的路径
          }, {
            type: 'like',
            text: '普通',
            extClass: 'test',
            src: '../../static/icons/recent_play/liked.png' // icon的路径
          }];
        }
      }
    }
    this.setData({
      musicInfo: {
        coverImgUrl: app.globalData.musicPlayer.coverImgUrl,
        id: app.globalData.musicPlayer.id,
        songName: app.globalData.musicPlayer.songName,
        singer: app.globalData.musicPlayer.singer,
        status: app.globalData.musicPlayer.status
      },
      songList
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
      let data = res.data.playlist;
      if (data.tracks.length) {
        const id =  getApp().globalData.musicPlayer.id;
        const likeList = getApp().globalData.musicData.likeList;
        for (let i = 0; i < data.tracks.length; i++) {
          const item = data.tracks[i];
          if (item.id == id) {
            // 当前播放标记
            data.tracks[i].active = true;
          }
          for (let j = 0; j < likeList.length; j++) {
            // 喜欢列表标记
            if (likeList[j].id == item.id) {
              data.tracks[i].like = true;
              data.tracks[i].buttons = [{
                type: 'play',
                text: '下一首播放',
                src: '../../static/icons/recent_play/next.png' // icon的路径
              }, {
                type: 'like',
                text: '普通',
                extClass: 'test',
                src: '../../static/icons/recent_play/liked.png' // icon的路径
              }];
            }
          }
        }
      }
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
      // wx.navigateTo({
      //   url: `/pages/player/player?id=${app.globalData.musicPlayer.id}`
      // })
    })
  },
  /**
   * 更改喜欢图标状态
   * @param {*} e 
   * @param {*} type
   */
  changeLikeStatus(e){
    const {
      index,
      type
    } = e.detail;
    const key = `songList[${index}].buttons`;
    const buttons = type == 'like' ? [{
      type: 'play',
      text: '下一首播放',
      src: '../../static/icons/recent_play/next.png' // icon的路径
    }, {
      type: 'like',
      text: '普通',
      extClass: 'test',
      src: '../../static/icons/recent_play/liked.png' // icon的路径
    }] : [{
      type: 'play',
      text: '下一首播放',
      src: '../../static/icons/recent_play/next.png' // icon的路径
    }, {
      type: 'like',
      text: '普通',
      extClass: 'test',
      src: '../../static/icons/recent_play/like.png' // icon的路径
    }];
    this.setData({
      [key]: buttons
    })
  }
})