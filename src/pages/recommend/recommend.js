const { getHotListApi } = require('../../api/api.js');
const app = getApp();
let recommendSongsTemplate = [];

Page({
  data: {
    recommendSongs: [],
    recommendSongsPage: 1,
    recommendSongsLoading: false
  },
  onLoad() {
    this.getHotList();
  },
  onShow() {
    this.setData({
      musicInfo: {
        songName: app.globalData.musicPlayer.songName,
        singer: app.globalData.musicPlayer.singer,
        status: app.globalData.musicPlayer.status
      }
    })
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

})