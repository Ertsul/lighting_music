const { getDefaultKeywordApi, searchApi } = require('../../api/api.js');
const util = require('../../common/js/util');

Page({
  data: {
    searchValue: '',
    defaultPlaceHolder: '',
    searchHistory: [],
    hotSearchList: [],
    songList: [],
    slideButtons: [{
      text: '下一首播放',
      src: '../../static/icons/recent_play/next.png' // icon的路径
    }, {
      text: '普通',
      extClass: 'test',
      src: '../../static/icons/recent_play/like.png' // icon的路径
    }]
  },
  onLoad() {
    this.getSearchHistory();
    this.getDefaultKeyword();
  },
  /**
   * 获取默认搜索关键词
   */
  async getDefaultKeyword() {
    try {
      const res = await getDefaultKeywordApi();
      console.log('获取默认搜索关键词', res.data.data);
      this.setData({
        searchValue: res.data.data.realkeyword || ''
        // defaultPlaceHolder: res.data.data.showKeyword || ''
      })
    } catch (error) {
      console.error("获取默认搜索关键词", error);
    }
  },
  /**
   * 点击历史搜索或者热门搜索进行搜索
   */
  clickItemToSearch(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      searchValue: value
    })
    this.cacheSearch(value);
    this.searchSong(value); // 调用搜索接口
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
    if (!value) {
      wx.showToast({
        title: '搜索关键词不能为空！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.cacheSearch(value);
    this.searchSong(value); // 调用搜索接口
  },
  blurHandler(e) {
    const {
      value = ''
    } = e.detail;
    if (value) {
      this.setData({
        searchValue: value
      })
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
      searchHistory: [],
      songList: []
    })
  },
  /**
   * 清除搜索输入 
   */
  clearInputValue() {
    if (this.data.searchValue) {
      this.setData({
        searchValue: "",
        songList: []
      })
    }
  },
  /**
   * 搜索歌曲
   * @param {*} songName 
   */
  async searchSong(songName) {
    try {
      const res = await searchApi({
        keywords: songName
      });
      console.log('搜索歌曲', res);
      if (res.data.result.order.includes('songs')) {
        console.log('搜索歌曲', res.data.result.songs);
        this.setData({
          songList: res.data.result.songs
        })
      } else {
        wx.showToast({
          title: '暂时搜索不到歌曲！',
          icon: 'none',
          duration: 2000
        })
      }
    } catch (error) {
      console.error("搜索歌曲", error);
    }
  }
})