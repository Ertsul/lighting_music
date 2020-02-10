Page({
  data: {
    txt: 'txt',
    ranklist: [
      {
        cover: 'http://img4.imgtn.bdimg.com/it/u=2958967064,2714608608&fm=26&gp=0.jpg',
        name: '榜单名',
        songList: [
          {
            songName: '歌名1',
            singer: '歌手名1'
          },
          {
            songName: '歌名2',
            singer: '歌手名2'
          },
          {
            songName: '歌名3',
            singer: '歌手名3'
          }
        ]
      }, {
        cover: 'http://img4.imgtn.bdimg.com/it/u=2958967064,2714608608&fm=26&gp=0.jpg',
        name: '榜单名',
        songList: [
          {
            songName: '歌名1',
            singer: '歌手名1'
          },
          {
            songName: '歌名2',
            singer: '歌手名2'
          },
          {
            songName: '歌名3',
            singer: '歌手名3'
          }
        ]
      }, {
        cover: 'http://img4.imgtn.bdimg.com/it/u=2958967064,2714608608&fm=26&gp=0.jpg',
        name: '榜单名',
        songList: [
          {
            songName: '歌名1',
            singer: '歌手名1'
          },
          {
            songName: '歌名2',
            singer: '歌手名2'
          },
          {
            songName: '歌名3',
            singer: '歌手名3'
          }
        ]
      }
    ]
  },
  onLoad() {
    console.log("rank onLoad");
  },
  async onShow() {
    try {
      const a = 1;
      const b = 2;
      const c = 10;
      const d = 200;
    } catch (error) {

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
  jumpRankDetailPage() {
    wx.navigateTo({
      url: '/pages/rankDetail/rankDetail'
    });
  }
})