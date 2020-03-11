const Router = require("./router/router");
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
    wx.setStorageSync('musicInfo', JSON.stringify({
      musicData: this.globalData.musicData,
      musicPlayer: this.globalData.musicPlayer
    }));
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
      this.globalData.musicPlayer.status = 'off'; // 切换播放器状态
      let {
        playList = [],
        index = 0
      } = this.globalData.musicData;
      if (!playList.length) {
        return;
      }
      if (index == playList.length - 1) { // 播放到最后一首，
        if (this.globalData.musicPlayer.loop) { // 循环播放模式
          index = 0;
        } else {
          return;
        }
      } else {
        index++;
      }
      this.globalData.audioContext.index = index;
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
    this.globalData.musicPlayer = musicPlayer;
    this.globalData.audioContext.src = musicData.playList[musicData.index].url;
    // this.globalData.audioContext.src = 'http://m701.music.126.net/20200311221825/7ef2981ecb1142a5f9295cb62a5bdf3c/jdymusic/obj/w5zDlMODwrDDiGjCn8Ky/1643178593/78c4/6354/fb10/a20e5b10ab9e97f6c915cd5cd73f5ded.mp3'
    this.globalData.musicPlayer.status = 'off';
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
      coverImgUrl: ''
    }
  }
})
// {"musicData":{"likeList":[],"playList":[{"id":1330348068,"url":"http://m7.music.126.net/20200311235514/7732aef6afb650e633aaa5b087b9cff7/ymusic/0758/550f/545f/028d3b9421be8425d60dc57735cf6ebc.mp3","songName":"起风了","singer":"买辣椒也用券"}],"index":0},"musicPlayer":{"natualPlay":false,"songName":"起风了","singer":"买辣椒也用券","status":"off","loop":false}}