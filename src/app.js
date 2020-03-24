const Router = require("./router/router");

const [
  RECYCLE_LIST_PLAY, // 列表循环
  RECYCLE_ONE_PLAY, // 单曲循环
  RANDOM_PLAY // 随机播放
] = [0, 1, 2];

//app.js
App({
  Router,
  onLaunch: async function () {
    await this.setaudioContext();
    this.getCacheMusicData();
  },
  onHide() {
    console.log("onHide", this.globalData.musicData);
    // 缓存当前歌曲信息，我的播放列表，我的喜欢音乐列表
    wx.setStorageSync('musicInfo', JSON.stringify({
      musicData: this.globalData.musicData,
      musicPlayer: {
        ...this.globalData.musicPlayer,
        currentIndex: 0,
        list: [],
        offsetTop: 0
      }
    }));
    // 缓存歌曲信息，当退出小程序时候重置歌曲播放页面的歌词位置信息
    // wx.setStorageSync('lyric', JSON.stringify({
    //   offsetTop: 0,
    //   currentIndex: 0,
    //   cacheIndex: this.globalData.musicPlayer.lyric.currentIndex
    // }))
    wx.setStorageSync('lyric', JSON.stringify({
      offsetTop: this.globalData.musicPlayer.lyric.offsetTop,
      currentIndex: this.globalData.musicPlayer.lyric.currentIndex,
      cacheIndex: this.globalData.musicPlayer.lyric.currentIndex
    }))
  },
  setaudioContext() {
    this.globalData.audioContext = wx.getBackgroundAudioManager();
    this.globalData.audioContext.onPlay(() => {
      console.log("onPlay");
      this.globalData.musicPlayer.status = 'on'; // 切换播放器状态
    })
    this.globalData.audioContext.onPause(() => {
      this.globalData.musicPlayer.status = 'off';
      console.log("onPause");
    })
    this.globalData.audioContext.onEnded(() => {
      console.log("onEnded");
      wx.setStorageSync('lyric', JSON.stringify({
        offsetTop: 0,
        currentIndex: 0
      }))
      this.globalData.musicPlayer.lyric = {
        currentIndex: 0,
        list: [],
        offsetTop: 0
      }
      this.globalData.musicPlayer.status = 'end'; // 切换播放器状态
      let {
        playList = [],
        index = 0
      } = this.globalData.musicData;
      if (!playList.length) {
        return;
      }
      if (this.globalData.musicPlayer.listPlayType == RECYCLE_LIST_PLAY) {
        if (index == playList.length - 1) { // 播放到最后一首
          index = 0;
        } else {
          index = index + 1;
        }
      } else if (this.globalData.musicPlayer.listPlayType == RANDOM_PLAY) {
        index = this.getRangeNum(0, playList.length - 1);
      }
      this.globalData.musicData.index = index;
      this.globalData.audioContext.src = playList[index].url;
      this.globalData.audioContext.title = playList[index].songName;
      this.globalData.audioContext.play();
      this.globalData.musicPlayer = {
        ...this.globalData.musicPlayer,
        songName: playList[index].songName,
        singer: playList[index].singer,
        id: playList[index].id,
        coverImgUrl: playList[index].coverImgUrl
      }
    })
    this.globalData.audioContext.onTimeUpdate(() => {
      let durationArr = this.formatTime(this.globalData.audioContext.duration).slice(0, 5).split(':');
      this.globalData.musicPlayer.timeOffset = this.globalData.musicPlayer.timeOffset + Math.floor(614 / (Number(durationArr[0]) * 60 + Number(durationArr[1])))
    })
  },
  formatTime(time) {
    let min = Math.floor(time / 60);
    min = min < 10 ? `0${min}` : min;
    let second = (time % 60) * 10;
    second = second < 10 ? `0${second.toFixed(2)}` : second.toFixed(2);
    return `${min}:${second}` == "00:00" ? '' : `${min}:${second}`
  },
  getRangeNum(min, max) {
    const range = max - min;
    const rand = Math.random();
    return min + Math.round(rand * range);
  },
  getCacheMusicData() {
    let musicInfo = wx.getStorageSync('musicInfo');
    if (!musicInfo) {
      return;
    }

    musicInfo = JSON.parse(musicInfo);
    const {
      musicData,
      musicPlayer
    } = musicInfo;
    let lyric = wx.getStorageSync('lyric') || "";
    if (lyric) {
      lyric = JSON.parse(lyric);
    } else {
      lyric = {
        cacheIndex: -1,
        currentIndex: 0,
        list: [],
        offsetTop: 0
      }
    }
    console.log('lyric', lyric);
    this.globalData.musicData = musicData;
    this.globalData.musicPlayer = {
      ...musicPlayer,
      listPlayType: RECYCLE_LIST_PLAY,
      timeOffset: 0,
      lyric: {
        currentIndex: lyric.currentIndex,
        cacheIndex: lyric.cacheIndex,
        list: [],
        offsetTop: 0
      }
    };
    console.log('lyric', this.globalData.musicPlayer.lyric);
    console.log("小程序启动 ================ 获取缓存信息 == start");
    console.log("小程序启动 ================ 喜欢音乐列表 == ", this.globalData.musicData.likeList);
    console.log("小程序启动 ================ 播放音乐列表 ==", this.globalData.musicData.playList);
    console.log("小程序启动 ================ 播放器信息 ==", this.globalData.musicPlayer);
    console.log("小程序启动 ================ 获取缓存信息 == end");
    if (!this.globalData.musicData.playList.length) {
      return;
    }
    if (!this.globalData.musicPlayer.songName && this.globalData.musicData.playList.length) { // 无当前播放歌曲信息，默认播放我的播放列表的第一首歌曲
      this.globalData.audioContext.src = musicData.playList[0].url;
      this.globalData.audioContext.title = musicData.playList[musicData.index].songName;
      this.globalData.musicPlayer = {
        ...this.globalData.musicPlayer,
        natualPlay: true, // 是否是自动播放
        songName: musicData.playList[0].songName, // 歌曲名
        singer: musicData.playList[0].singer, // 歌手名
        status: 'off', // 音乐播放器状态 'on' or 'off'
        loop: false, // 是否循环播放
        id: musicData.playList[0].id,
        coverImgUrl: musicData.playList[0].coverImgUrl,
        listPlayType: RECYCLE_LIST_PLAY,
        timeOffset: 0
      }
    } else {
      this.globalData.audioContext.title = musicData.playList[musicData.index].songName;
      this.globalData.audioContext.src = musicData.playList[musicData.index].url;
    }
    this.globalData.musicPlayer.status = 'off';
    this.globalData.audioContext.pause();
  },
  globalData: {
    audioContext: null,
    userInfo: null,
    musicData: { // 音乐数据
      likeList: [],
      playList: [], // 音乐列表
      index: 0 // 当前播放索引
    },
    musicPlayer: {
      natualPlay: true, // 是否是自动播放
      songName: '', // 歌曲名
      singer: '', // 歌手名
      status: 'on', // 音乐播放器状态 'on' or 'off'
      loop: false, // 是否循环播放
      id: 0,
      coverImgUrl: '',
      listPlayType: RECYCLE_LIST_PLAY,
      timeOffset: 0,
      lyric: {
        cacheIndex: -1,
        currentIndex: 0,
        list: [],
        offsetTop: 0
      }
    }
  }
})