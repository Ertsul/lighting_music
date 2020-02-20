const { getHotListApi } = require('../../api/api.js');

let recommendSongsTemplate = [];

Page({
  data: {
    //   'http://img0.imgtn.bdimg.com/it/u=1563847232,2166245740&fm=26&gp=0.jpg',
    //   'http://img4.imgtn.bdimg.com/it/u=2958967064,2714608608&fm=26&gp=0.jpg',
    //   'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
    //   'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg
    // hotSongs: [
    //   {
    //     img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
    //     songName: 'Lemon',
    //     singer: '米津玄师'
    //   },
    //   {
    //     img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
    //     songName: 'Lemon',
    //     singer: '米津玄师'
    //   },
    //   {
    //     img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
    //     songName: 'Lemon',
    //     singer: '米津玄师'
    //   },
    //   {
    //     img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
    //     songName: 'Lemon',
    //     singer: '米津玄师'
    //   },
    //   {
    //     img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
    //     songName: 'Lemon',
    //     singer: '米津玄师'
    //   },
    //   {
    //     img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
    //     songName: 'Lemon',
    //     singer: '米津玄师'
    //   },
    // ],
    // recommendSongs: [
    //   {
    //     img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
    //     counts: 1000,
    //     name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
    //   },
    //   {
    //     img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
    //     counts: 1000,
    //     name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
    //   },
    //   {
    //     img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
    //     counts: 1000,
    //     name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
    //   }, {
    //     img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
    //     counts: 1000,
    //     name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
    //   },
    //   {
    //     img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
    //     counts: 1000,
    //     name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
    //   },
    //   {
    //     img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
    //     counts: 1000,
    //     name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
    //   }
    // ]
    recommendSongs: [],
    recommendSongsPage: 1,
    recommendSongsLoading: false
  },
  onLoad() {
    this.getHotList();
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