const [SELF_BUILD_LIST, COLLECT_LIST] = [0, 1];
const app = getApp();
const [
  LIKE_LIST,
  RERENT_PLAY_LIST
] = [0, 1];
Page({
  data: {
    currentActiveTab: LIKE_LIST,
    likeList: [],
    playList: [],
    musicInfo: {},
    slideButtons1: [{
      type: 'like',
      text: '普通',
      extClass: 'test',
      src: '../../static/icons/recent_play/like.png' // icon的路径
    }, {
      type: 'delete',
      text: '警示',
      extClass: 'test',
      src: '../../static/icons/recent_play/delete.png' // icon的路径
    }],
    slideButtons2: [{
      type: 'play',
      text: '下一首播放',
      src: '../../static/icons/recent_play/next.png' // icon的路径
    }, {
      type: 'delete',
      text: '警示',
      extClass: 'test',
      src: '../../static/icons/recent_play/delete.png' // icon的路径
    }]
  },
  onShow() {
    this.setData({
      likeList: app.globalData.musicData.likeList,
      playList: app.globalData.musicData.playList,
      musicInfo: {
        coverImgUrl: app.globalData.musicPlayer.coverImgUrl,
        id: app.globalData.musicPlayer.id,
        songName: app.globalData.musicPlayer.songName,
        singer: app.globalData.musicPlayer.singer,
        status: app.globalData.musicPlayer.status
      }
    })
  },
  /**
   * 切换 tab
   * @param {*} e 
   */
  changeTab(e) {
    const currentActiveTab = e.target.dataset.index || 0;
    this.setData({
      currentActiveTab,
      likeList: app.globalData.musicData.likeList,
      playList: app.globalData.musicData.playList
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
  /**
   * 跳转最近播放页面
   */
  jumpRecentPlayPage() {
    wx.navigateTo({
      url: '/pages/recentPlay/recentPlay'
    });
  },
})