Page({
  data: {
    //   'http://img0.imgtn.bdimg.com/it/u=1563847232,2166245740&fm=26&gp=0.jpg',
    //   'http://img4.imgtn.bdimg.com/it/u=2958967064,2714608608&fm=26&gp=0.jpg',
    //   'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
    //   'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg
    hotSongs: [
      {
        img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
        songName: 'Lemon',
        singer: '米津玄师'
      },
      {
        img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
        songName: 'Lemon',
        singer: '米津玄师'
      },
      {
        img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
        songName: 'Lemon',
        singer: '米津玄师'
      },
      {
        img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
        songName: 'Lemon',
        singer: '米津玄师'
      },
      {
        img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
        songName: 'Lemon',
        singer: '米津玄师'
      },
      {
        img: 'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg',
        songName: 'Lemon',
        singer: '米津玄师'
      },
    ],
    recommendSongs: [
      {
        img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
        counts: 1000,
        name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
      },
      {
        img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
        counts: 1000,
        name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
      },
      {
        img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
        counts: 1000,
        name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
      }, {
        img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
        counts: 1000,
        name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
      },
      {
        img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
        counts: 1000,
        name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
      },
      {
        img: 'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
        counts: 1000,
        name: '歌单名歌单名歌单名歌单名歌单名歌单名歌单名'
      }
    ]
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
  jumpSongSheetPage() {
    wx.navigateTo({
      url: '/pages/songSheet/songSheet'
    });
  }
})