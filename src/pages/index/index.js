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
  onLoad() {
    this.timeUpdate();
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
    this.timeUpdate();
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