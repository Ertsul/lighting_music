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
    wx.setStorageSync(
      "lyric",
      JSON.stringify({
        currentTime: '',
        timeOffset: '',
        toViewId: 'L0'
      })
    );
  },
  setaudioContext() {
    this.globalData.audioContext = wx.getBackgroundAudioManager(); // 创建背景音乐对象
    // 监听播放事件
    this.globalData.audioContext.onPlay(() => {
      console.log("播放 onPlay");
      this.globalData.musicPlayer.status = 'on'; // 切换播放器状态
    })
    // 监听暂停事件
    this.globalData.audioContext.onPause(() => {
      console.log("暂停 onPause");
      this.globalData.musicPlayer.status = 'off';
    })
    // 监听结束事件
    this.globalData.audioContext.onEnded(() => {
      console.log("结束 onEnded");
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
    this.globalData.musicData = musicData;
    this.globalData.musicPlayer = {
      ...musicPlayer,
      listPlayType: RECYCLE_LIST_PLAY,
    };
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
        songName: musicData.playList[0].songName, // 歌曲名
        singer: musicData.playList[0].singer, // 歌手名
        status: 'off', // 音乐播放器状态 'on' or 'off'
        id: musicData.playList[0].id,
        coverImgUrl: musicData.playList[0].coverImgUrl,
        listPlayType: RECYCLE_LIST_PLAY,
      }
    } else {
      this.globalData.audioContext.title = musicData.playList[musicData.index].songName;
      this.globalData.audioContext.src = musicData.playList[musicData.index].url;
    }
    this.globalData.audioContext.pause();
    this.globalData.musicPlayer.status = 'off';
  },
  globalData: {
    audioContext: null,
    musicData: { // 音乐数据
      likeList: [],
      playList: [], // 音乐列表
      index: 0 // 当前播放索引
    },
    musicPlayer: {
      songName: '', // 歌曲名
      singer: '', // 歌手名
      status: 'on', // 音乐播放器状态 'on' or 'off'
      id: 0,
      coverImgUrl: '',
      listPlayType: RECYCLE_LIST_PLAY,
      timeOffset: 0,
    }
  }
})