const { getTopListApi } = require('../../api/api.js');
const app = getApp();

Page({
  data: {
    txt: 'txt',
    ranklist: []
  },
  onLoad() {
    this.timeUpdate();
    console.log("rank onLoad");
    this.getTopList();
  },
  async onShow() {
    this.setData({
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
   * 所有榜单内容摘要
   */
  async getTopList() {
    try {
      const res = await getTopListApi();
      console.log("所有榜单内容摘要", res.data.list);
      this.setData({
        ranklist: res.data.list
      })
    } catch (error) {
      console.error('所有榜单内容摘要', error);
    }
  },
  /**
   * 跳转搜索页面
   */
  jumpSearchPage() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },
  /**
   * 跳转排行榜详情
   */
  jumpRankDetailPage(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/songSheet/songSheet?id=${id}`
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