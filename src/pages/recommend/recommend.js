const { getHotListApi } = require('../../api/api.js');
// const timeUpdate = require('../../behaviors/timeUpdate.js');
const app = getApp();
Page({
  // behaviors: [timeUpdate],
  data: {
    recommendSongs: [],
    recommendSongsPage: 1,
    recommendSongsLoading: false
  },
  onLoad() {
    this.timeUpdate();
    this.getHotList();
  },
  onShow() {
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
   * 跳转搜索页面
   */
  jumpSearchPage() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },
  /**
   * 跳转推荐歌单详情页面
   */
  jumpSongSheetPage(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/songSheet/songSheet?id=${id}`
    });
  },
  /**
   * 获取推荐歌单
   */
  async getHotList() {
    try {
      let { recommendSongs, recommendSongsPage } = this.data;
      this.setData({
        recommendSongsLoading: true
      })
      const {
        data: {
          total = 0,
          playlists = []
        }
      } = await getHotListApi({
        limit: 6 * recommendSongsPage, // 每次 6 个歌单
        order: 'hot' // 拉取热歌数据
      });
      let pageData = {
        recommendSongsLoading: false
      }
      if (total > 0) {
        let list = playlists;
        if (recommendSongs.length >= 6) {
          list = list.slice(6 * (recommendSongsPage - 1));
        }
        recommendSongs = [...recommendSongs, ...list];
        pageData = {
          ...pageData,
          recommendSongs,
          recommendSongsPage: recommendSongsPage + 1
        }
      }
      this.setData(pageData);
    } catch (error) {
      console.error(error);
    }
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