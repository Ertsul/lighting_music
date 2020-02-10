const [SELF_BUILD_LIST, COLLECT_LIST] = [0, 1];

Page({
  data: {
    txt: 'txt',
    userInfo: {
      // avatarUrl: "../../static/images/2.jpg",
      // nickName: "Ynnus"
      // avatarUrl: "",
      // nickName: "",
    },
    currentActiveTab: 0,
    selfBuildList: [ // 自建歌单
    ],
    collectList: [ // 收藏歌单
    ],
    i: 0,
    imgsArr: [
      'http://img0.imgtn.bdimg.com/it/u=1563847232,2166245740&fm=26&gp=0.jpg',
      'http://img4.imgtn.bdimg.com/it/u=2958967064,2714608608&fm=26&gp=0.jpg',
      'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
      'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg'
    ]
  },
  onLoad() {
    console.log("index onLoad");
    // setInterval(() => {
    //   let index = this.data.i;
    //   if (index == this.data.imgsArr.length) {
    //     index = 0;
    //   }
    //   const currentImg = this.data.imgsArr[index];
    //   const img = 'userInfo.avatarUrl';
    //   this.setData({
    //     [img]: currentImg,
    //     i: ++index
    //   })
    // }, 1500)
  },
  async onShow() {
    try {
      const a = 1;
      const b = 2;
      const c = 10;
      const d = 200;
      // let imgsArr = [
      //   'http://img0.imgtn.bdimg.com/it/u=1563847232,2166245740&fm=26&gp=0.jpg',
      //   'http://img4.imgtn.bdimg.com/it/u=2958967064,2714608608&fm=26&gp=0.jpg',
      //   'http://img4.imgtn.bdimg.com/it/u=4013814910,1099586848&fm=26&gp=0.jpg',
      //   'http://img5.imgtn.bdimg.com/it/u=441837680,1650038187&fm=26&gp=0.jpg'
      // ];
      // let i = 0;
      
    } catch (error) {

    }
  },
  /**
   * 切换 tab
   * @param {*} e 
   */
  changeTab(e) {
    const currentActiveTab = e.target.dataset.index || 0;
    this.setData({
      currentActiveTab
    })
  },
  /**
   * 跳转最近播放页面
   */
  jumpRecentPlayPage() {
    wx.navigateTo({
      url: '/pages/recentPlay/recentPlay'
    });
  }
})