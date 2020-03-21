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
    this.globalData.audioContext.pause();
    this.globalData.musicPlayer.status = 'off';
    // 缓存当前歌曲信息，我的播放列表，我的喜欢音乐列表
    wx.setStorageSync('musicInfo', JSON.stringify({
      musicData: this.globalData.musicData,
      musicPlayer: this.globalData.musicPlayer
    }));
    // 缓存歌曲信息，当退出小程序时候重置歌曲播放页面的歌词位置信息
    wx.setStorageSync('lyric', JSON.stringify({
      offsetTop: 0,
      currentIndex: 0
    }))
    // wx.playBackgroundAudio({
    //   dataUrl: this.globalData.musicData.playList[this.globalData.musicData.index],
    //   title: '',
    //   coverImgUrl: ''
    // })
  },
  setaudioContext() {
    this.globalData.audioContext = wx.createInnerAudioContext();
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
      console.warn("onTimeUpdate duration", durationArr, this.globalData.musicPlayer.timeOffset);
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
      timeOffset: 0
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
      this.globalData.musicPlayer = {
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
      this.globalData.audioContext.src = musicData.playList[musicData.index].url;
    }
    // // this.globalData.audioContext.src = 'http://m701.music.126.net/20200311221825/7ef2981ecb1142a5f9295cb62a5bdf3c/jdymusic/obj/w5zDlMODwrDDiGjCn8Ky/1643178593/78c4/6354/fb10/a20e5b10ab9e97f6c915cd5cd73f5ded.mp3'
    // this.globalData.musicPlayer.status = 'off';
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
      timeOffset: 0
    }
  }
})
// {"musicData":{"likeList":[],"playList":[{"id":1330348068,"url":"http://m7.music.126.net/20200311235514/7732aef6afb650e633aaa5b087b9cff7/ymusic/0758/550f/545f/028d3b9421be8425d60dc57735cf6ebc.mp3","songName":"起风了","singer":"买辣椒也用券"}],"index":0},"musicPlayer":{"natualPlay":false,"songName":"起风了","singer":"买辣椒也用券","status":"off","loop":false}}