import {
  getLyricApi
} from '../../api/api.js'

const app = getApp();

const [
  RECYCLE_LIST_PLAY, // 列表循环
  RECYCLE_ONE_PLAY, // 单曲循环
  RANDOM_PLAY // 随机播放
] = [0, 1, 2]

Page({
  data: {
    lyric: "",
    lyricList: [],
    cacheIndex: 0,
    currentIndex: 0,
    offsetTop: 0,
    lastIndex: 0,
    id: '',
    cacheLyricIdx: 0,
    cacheLyricOffset: 0,
    currentTime: "00:00",
    pointPercent: 0,
    listPlayType: RECYCLE_LIST_PLAY
  },
  async onLoad(options) {
    console.log(":::: Player Page onload", options);
    this.setData({
      id: options.id
    })
  },
  async onShow() {
    let cacheLyric = wx.getStorageSync('lyric');
    console.log('onshow', cacheLyric);
    let offsetTop = 0;
    let currentIndex = 0;
    if (cacheLyric) {
      cacheLyric = JSON.parse(cacheLyric);
      offsetTop = cacheLyric.offsetTop;
      currentIndex = cacheLyric.currentIndex;
    }
    const duration = this.formatTime(app.globalData.audioContext.duration).slice(0, 5);
    console.log("musicTimeUpdateHandler", app.globalData.audioContext.duration, duration);
    this.setData({
      musicInfo: {
        songName: app.globalData.musicPlayer.songName,
        singer: app.globalData.musicPlayer.singer,
        status: app.globalData.musicPlayer.status,
        id: app.globalData.musicPlayer.id,
        coverImgUrl: app.globalData.musicPlayer.coverImgUrl
      },
      duration,
      offsetTop,
      currentIndex,
      cacheIndex: currentIndex
    })
    await this.getLyric(this.data.id);
    await this.formatLyric();
    this.musicPlayHandler();
    this.musicTimeUpdateHandler();
  },
  onHide() {
    console.log("onHide");
    wx.setStorageSync('lyric', JSON.stringify({
      offsetTop: this.data.offsetTop,
      currentIndex: this.data.currentIndex,
      currentTime: this.data.currentTime
    }))
  },
  async getLyric(id) {
    try {
      const res = await getLyricApi({
        id
      })
      console.log(res);
      this.setData({
        lyric: res.data.lrc.lyric || ''
      })
    } catch (error) {
      console.error(error);
    }
  },
  async musicPlayHandler() {
    // app.globalData.audioContext.onPlay(async () => {
    //   console.log("shitshishishsihisishhsihsihsishisishi", this.data.musicInfo.id, app.globalData.musicPlayer.id);
    //   if (this.data.musicInfo.id != app.globalData.musicPlayer.id) { // 自动切换
    //     let offsetTop = 0;
    //     let currentIndex = 0;
    //     const duration = this.formatTime(app.globalData.audioContext.duration).slice(0, 5);
    //     console.log("musicTimeUpdateHandler", app.globalData.audioContext.duration, duration);
    //     this.setData({
    //       musicInfo: {
    //         songName: app.globalData.musicPlayer.songName,
    //         singer: app.globalData.musicPlayer.singer,
    //         status: app.globalData.musicPlayer.status,
    //         id: app.globalData.musicPlayer.id,
    //         coverImgUrl: app.globalData.musicPlayer.coverImgUrl
    //       },
    //       duration,
    //       offsetTop,
    //       currentIndex,
    //       cacheIndex: currentIndex
    //     })
    //     await this.getLyric(app.globalData.musicPlayer.id);
    //     await this.formatLyric();
    //     this.musicPlayHandler();
    //     this.musicTimeUpdateHandler();
    //   }
    // })
  },
  /**
   * 监听音频播放进度更新事件
   */
  musicTimeUpdateHandler() {
    console.log("musicTimeUpdateHandler", app.globalData.audioContext.duration);
    app.globalData.audioContext.onTimeUpdate(() => {
      let obj = this.formatTime1(app.globalData.audioContext.currentTime);
      let str = `${obj.m}:${obj.s}`;
      console.log(app.globalData.audioContext.currentTime, '-----', str);
      let i = this.data.cacheIndex;
      if (str != this.data.currentTime) {
        this.setData({
          currentTime: str
        })
      }
      for (i; i < this.data.lyricList.length; i++) {
        const item = this.data.lyricList[i];
        if (item.time.split('.')[0] == str) {
          if (this.data.currentIndex != i) {
            this.setData({
              currentIndex: i,
              offsetTop: this.data.offsetTop - 70,
              lastIndex: item.time.split('.')[0]
            })
            break
          }
        }
      }
      console.log('---------------------------------------');
    })
  },
  formatLyric() {
    let lyric = this.data.lyric;
    let lyricList = lyric.split('[').reduce((prev, cur) => {
      const curArr = cur.split(']');
      const time = curArr[0];
      const text = curArr[1];
      (text && text.trim()) && prev.push({
        time,
        text: text.trim()
      })
      return prev;
    }, [])
    this.setData({
      lyricList
    })
  },
  repairZero(num) {
    return num < 10 ? '0' + num : num;
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
    return `${min}:${second}`
  },
  navigateBack() {
    let lyric = {
      offsetTop: this.data.offsetTop,
      currentIndex: this.data.currentIndex,
      currentTime: this.data.currentTime
    }
    if (app.globalData.musicPlayer.status == 'end') {
      lyric = {
        offsetTop: 0,
        currentIndex: 0,
        currentTime: 0
      }
    }
    wx.setStorageSync('lyric', JSON.stringify(lyric))
    wx.navigateBack({
      delta: 1
    })
  },
  /**
     * 切换音乐播放状态
     */
  changePlayStatus() {
    console.log('changePlayStatus', app.globalData.musicPlayer.status);
    if (app.globalData.musicPlayer.status == 'off') {
      app.globalData.audioContext.play();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        status: "on"
      }
      const musicInfo = {
        ...this.data.musicInfo,
        status: 'on'
      }
      this.setData({
        musicInfo
      })
    } else {
      app.globalData.audioContext.pause();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        status: "off"
      }
      const musicInfo = {
        ...this.data.musicInfo,
        status: 'off'
      }
      this.setData({
        musicInfo
      })
    }
  },
  /**
   * 上一首
   */
  async prevSong() {
    if (app.globalData.musicPlayer.listPlayType == RECYCLE_LIST_PLAY) { // 列表循环
      let {
        playList = [],
        index = 0
      } = app.globalData.musicData;
      console.log("playList index", playList, index);
      if (!playList.length) {
        return;
      }

      if (index == 0) {
        console.log("播放到第一首");
        index = playList.length - 1;
      } else {
        index = index - 1;
      }
      app.globalData.audioContext.stop();
      app.globalData.musicData.index = index;
      app.globalData.audioContext.src = playList[index].url;
      await this.getLyric(playList[index].id);
      await this.formatLyric();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        songName: playList[index].songName,
        singer: playList[index].singer,
        id: playList[index].id,
        coverImgUrl: playList[index].coverImgUrl,
        status: "on"
      }
      this.setData({
        musicInfo: {
          songName: app.globalData.musicPlayer.songName,
          singer: app.globalData.musicPlayer.singer,
          id: app.globalData.musicPlayer.id,
          coverImgUrl: app.globalData.musicPlayer.coverImgUrl
        },
        offsetTop: 0,
        currentIndex: 0,
        cacheIndex: 0,
        duration: this.formatTime(app.globalData.audioContext.duration).slice(0, 5)
      })
      setTimeout(() => {
        app.globalData.audioContext.play();
      }, 100)
    } else if (app.globalData.musicPlayer.listPlayType == RECYCLE_ONE_PLAY) { // 单曲循环
      this.setData({
        offsetTop: 0,
        currentIndex: 0,
        cacheIndex: 0
      })
      this.musicTimeUpdateHandler();
      app.globalData.audioContext.stop();
      // app.globalData.audioContext.play();
      setTimeout(() => {
        app.globalData.audioContext.play();
      }, 100)
    } else { // 随机播放
      let {
        playList = []
      } = app.globalData.musicData;
      if (!playList.length) {
        return;
      }
      const index = this.getRangeNum(0, playList.length - 1);
      app.globalData.audioContext.stop();
      app.globalData.musicData.index = index;
      app.globalData.audioContext.src = playList[index].url;
      await this.getLyric(playList[index].id);
      await this.formatLyric();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        songName: playList[index].songName,
        singer: playList[index].singer,
        id: playList[index].id,
        coverImgUrl: playList[index].coverImgUrl,
        status: "on"
      }
      this.setData({
        musicInfo: {
          songName: app.globalData.musicPlayer.songName,
          singer: app.globalData.musicPlayer.singer,
          id: app.globalData.musicPlayer.id,
          coverImgUrl: app.globalData.musicPlayer.coverImgUrl
        },
        offsetTop: 0,
        currentIndex: 0,
        cacheIndex: 0,
        duration: this.formatTime(app.globalData.audioContext.duration).slice(0, 5)
      })
      setTimeout(() => {
        app.globalData.audioContext.play();
      }, 100)
    }
  },
  /**
   * 下一首
   */
  async nextSong() {
    console.log("app.globalData.musicPlayer.listPlayType", app.globalData.musicPlayer.listPlayType);
    console.log("app.globalData.musicPlayer.listPlayType", app.globalData.musicPlayer.listPlayType);
    if (app.globalData.musicPlayer.listPlayType == RECYCLE_LIST_PLAY) { // 列表循环
      let {
        playList = [],
        index = 0
      } = app.globalData.musicData;
      if (!playList.length) {
        return;
      }
      if (index == playList.length - 1) {
        console.log("播放到最后一首");
        index = 0;
      } else {
        index = index + 1;
      }
      app.globalData.audioContext.stop();
      app.globalData.musicData.index = index;
      app.globalData.audioContext.src = playList[index].url;
      await this.getLyric(playList[index].id);
      await this.formatLyric();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        songName: playList[index].songName,
        singer: playList[index].singer,
        id: playList[index].id,
        coverImgUrl: playList[index].coverImgUrl
      }
      this.setData({
        musicInfo: {
          songName: app.globalData.musicPlayer.songName,
          singer: app.globalData.musicPlayer.singer,
          status: "on",
          id: app.globalData.musicPlayer.id,
          coverImgUrl: app.globalData.musicPlayer.coverImgUrl
        },
        offsetTop: 0,
        currentIndex: 0,
        cacheIndex: 0,
        duration: this.formatTime(app.globalData.audioContext.duration).slice(0, 5)
      })
      setTimeout(() => {
        app.globalData.audioContext.play();
      }, 100)
    } else if (app.globalData.musicPlayer.listPlayType == RECYCLE_ONE_PLAY) { // 单曲循环
      this.setData({
        offsetTop: 0,
        currentIndex: 0,
        cacheIndex: 0
      })
      this.musicTimeUpdateHandler();
      app.globalData.audioContext.stop();
      setTimeout(() => {
        app.globalData.audioContext.play();
      }, 100)
    } else { // 随机播放
      let {
        playList = []
      } = app.globalData.musicData;
      if (!playList.length) {
        return;
      }
      const index = this.getRangeNum(0, playList.length - 1);
      console.log("indexindex", index);

      app.globalData.audioContext.stop();
      app.globalData.musicData.index = index;
      app.globalData.audioContext.src = playList[index].url;
      await this.getLyric(playList[index].id);
      await this.formatLyric();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        songName: playList[index].songName,
        singer: playList[index].singer,
        id: playList[index].id,
        coverImgUrl: playList[index].coverImgUrl,
        status: "on"
      }
      this.setData({
        musicInfo: {
          songName: app.globalData.musicPlayer.songName,
          singer: app.globalData.musicPlayer.singer,
          id: app.globalData.musicPlayer.id,
          coverImgUrl: app.globalData.musicPlayer.coverImgUrl
        },
        offsetTop: 0,
        currentIndex: 0,
        cacheIndex: 0,
        duration: this.formatTime(app.globalData.audioContext.duration).slice(0, 5)
      })
      setTimeout(() => {
        app.globalData.audioContext.play();
      }, 100)
    }
  },
  /**
   * 更改歌曲切换模式
   */
  changeListPlayType(e) {
    this.setData({
      listPlayType: e.currentTarget.dataset.type
    })
    app.globalData.musicPlayer.listPlayType = e.currentTarget.dataset.type;
    console.log('更改歌曲切换模式', e.currentTarget.dataset.type, app.globalData.musicPlayer.listPlayType);
  },
  getRangeNum(min, max) {
    const range = max - min;
    const rand = Math.random();
    return min + Math.round(rand * range);
  }
})