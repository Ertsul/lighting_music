const { getTopListApi } = require('../../api/api.js');
const app = getApp();

Page({
  data: {
    txt: 'txt',
    ranklist: []
  },
  onLoad() {
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
})