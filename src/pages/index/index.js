const [SELF_BUILD_LIST, COLLECT_LIST] = [0, 1];
const app = getApp();
const [
  LIKE_LIST,
  RERENT_PLAY_LIST
] = [0, 1];
Page({
  data: {
    ifMultiSelect: false,
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
    const {
      playList = [],
      likeList = []
    } = this.signList();
    this.setData({
      musicInfo: {
        coverImgUrl: app.globalData.musicPlayer.coverImgUrl,
        id: app.globalData.musicPlayer.id,
        songName: app.globalData.musicPlayer.songName,
        singer: app.globalData.musicPlayer.singer,
        status: app.globalData.musicPlayer.status
      },
      playList,
      likeList
    })
  },
  /**
   * 标记列表
   */
  signList() {
    let likeList = app.globalData.musicData.likeList;
    let playList = app.globalData.musicData.playList;
    const id = app.globalData.musicPlayer.id;
    for (let i = 0; i < playList.length; i++) {
      const item = playList[i];
      if (item.id == id) {
        // 当前播放标记
        playList[i].active = true;
      }
      for (let j = 0; j < likeList.length; j++) {
        // 喜欢列表标记
        if (likeList[j].id == item.id) {
          playList[i].like = true;
          playList[i].buttons = [{
            type: 'like',
            text: '普通',
            extClass: 'test',
            src: '../../static/icons/recent_play/liked.png' // icon的路径
          }, {
            type: 'delete',
            text: '警示',
            extClass: 'test',
            src: '../../static/icons/recent_play/delete.png' // icon的路径
          }];
        }
      }
    }
    return {
      playList,
      likeList
    };
  },
  /**
   * 切换 tab
   * @param {*} e 
   */
  changeTab(e) {
    const currentActiveTab = e.currentTarget.dataset.index || 0;
    const {
      playList = [],
      likeList = []
    } = this.signList();
    this.setData({
      currentActiveTab,
      likeList,
      playList
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
   * 跳转最近播放页面
   */
  jumpRecentPlayPage() {
    wx.navigateTo({
      url: '/pages/recentPlay/recentPlay'
    });
  },
  /**
   * 更改喜欢图标状态
   * @param {*}} e 
   */
  changeLikeStatus(e){
    const {
      index,
      type
    } = e.detail;
    const key = `playList[${index}].buttons`;
    const buttons = type == 'like' ? [{
      type: 'like',
      text: '普通',
      extClass: 'test',
      src: '../../static/icons/recent_play/liked.png' // icon的路径
    }, {
      type: 'delete',
      text: '警示',
      extClass: 'test',
      src: '../../static/icons/recent_play/delete.png' // icon的路径
    }] : [{
      type: 'like',
      text: '普通',
      extClass: 'test',
      src: '../../static/icons/recent_play/like.png' // icon的路径
    }, {
      type: 'delete',
      text: '警示',
      extClass: 'test',
      src: '../../static/icons/recent_play/delete.png' // icon的路径
    }];
    this.setData({
      [key]: buttons
    })
  },
  /**
   * 删除音乐
   * @param {*} e 
   */
  deleteMusic(e) {
    try {
      const index = e.detail;
      if (this.data.currentActiveTab == LIKE_LIST) {
        let likeList = this.data.likeList;
        likeList.splice(index, 1);
        this.setData({
          likeList
        })
        app.globalData.musicData.likeList.splice(index, 1);
      } else {
        let playList = this.data.playList;
        playList.splice(index, 1);
        this.setData({
          playList
        })
        app.globalData.musicData.playList.splice(index, 1);
      }
      wx.showToast({
        title: "删除成功",
        icon: "success",
        duration: 2000
      });
    } catch (error) {
      console.error("删除音乐", e);
    }
  }
})