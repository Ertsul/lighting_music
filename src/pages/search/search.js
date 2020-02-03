Page({
  data: {
    searchHistory: [],
    hotSearchList: [],
  },
  onLoad() {
    this.getSearchHistory();
  },
  /**
   * 获取搜索历史
   */
  getSearchHistory() {
    const searchHistory = wx.getStorageSync('searchHistory') || [];
    this.setData({
      searchHistory
    })
  },
  /**
   * 输入结束，确认搜索
   * @param {*} e 
   */
  confirmHandler(e) {
    const {
      value = ''
    } = e.detail;
    if (value) {
      this.cacheSearch(value);
      this.searchSong(value); // 调用搜索接口
    }
  },
  /**
   * 缓存搜索历史
   * @param {*} songName 
   */
  cacheSearch(songName) {
    let searchHistory = this.data.searchHistory;
    if (searchHistory.length === 10) { // 最多缓存 10 个搜索记录
      searchHistory.shift();
    }
    searchHistory.push(songName);
    searchHistory = [...new Set(searchHistory)]; // 去重
    this.setData({
      searchHistory
    })
    wx.setStorageSync("searchHistory", searchHistory);
  },
  /**
   * 清除搜索历史缓存
   */
  clearSearchCache() {
    wx.removeStorageSync('searchHistory');
    this.setData({
      searchHistory: []
    })
  },
  /**
   * 搜索歌曲
   * @param {*} songName 
   */
  searchSong(songName) {

  }
})