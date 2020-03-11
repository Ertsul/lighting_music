import {
  getLyricApi
} from '../../api/api.js'

const app = getApp();

Page({
  data: {
    lyric: "",
    lyricList: [],
    currentIndex: 0,
    offsetTop: 0,
    lastIndex: 0,
    id: '',
  },
  async onLoad(options) {
    console.log(":::: Player Page onload", options);
    this.setData({
      id: options.id
    })
  },
  async onShow() {
    this.setData({
      musicInfo: {
        songName: app.globalData.musicPlayer.songName,
        singer: app.globalData.musicPlayer.singer,
        status: app.globalData.musicPlayer.status,
        id: app.globalData.musicPlayer.id,
        coverImgUrl: app.globalData.musicPlayer.coverImgUrl
      }
    })
    await this.getLyric(this.data.id);
    await this.formatLyric();
    this.musicTimeUpdateHandler();
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
  /**
   * 监听音频播放进度更新事件
   */
  musicTimeUpdateHandler() {
    app.globalData.audioContext.onTimeUpdate(() => {
      let obj = this.formatTime1(app.globalData.audioContext.currentTime);
      let str = `${obj.m}:${obj.s}`;
      console.log(app.globalData.audioContext.currentTime, '-----', str);
      for (let i = 0; i < this.data.lyricList.length; i++) {
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
    const obj = {
      h,
      m,
      s,
    }
    return obj;
  },
  formatTime(time) {
    let min = Math.floor(time / 60);
    min = min < 10 ? `0${min}` : min;
    let second = (time % 60) * 10;
    second = second < 10 ? `0${second.toFixed(2)}` : second.toFixed(2);
    return `${min}:${second}`
  }
})