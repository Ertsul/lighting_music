const [SELF_BUILD_LIST, COLLECT_LIST] = [0, 1];

Page({
  data: {
    txt: 'txt',
    userInfo: {
      avatarUrl: "https://avatars0.githubusercontent.com/u/17139306?s=460&v=4",
      nickName: "Ertsul"
      // avatarUrl: "",
      // nickName: "",
    },
    currentActiveTab: 0,
    selfBuildList: [ // 自建歌单
      {
        name: "自建歌单名",
        url: "",
        counts: 1010
      },
      {
        name: "自建歌单名",
        url: "",
        counts: 1010
      },
      {
        name: "自建歌单名",
        url: "",
        counts: 1010
      },
      {
        name: "自建歌单名",
        url: "",
        counts: 1010
      },
      {
        name: "自建歌单名",
        url: "",
        counts: 1010
      },
      {
        name: "自建歌单名",
        url: "",
        counts: 1010
      },
    ],
    collectList: [ // 收藏歌单
      {
        name: "收藏歌单名",
        url: "",
        counts: 9999
      },
      {
        name: "收藏歌单名",
        url: "",
        counts: 9999
      },
      {
        name: "收藏歌单名",
        url: "",
        counts: 9999
      },
      {
        name: "收藏歌单名",
        url: "",
        counts: 9999
      },
      {
        name: "收藏歌单名",
        url: "",
        counts: 9999
      },
      {
        name: "收藏歌单名",
        url: "",
        counts: 9999
      },
    ],
  },
  onLoad() {
    console.log("index onLoad");
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
   * 切换 tab
   * @param {*} e 
   */
  changeTab(e) {
    const currentActiveTab = e.target.dataset.index || 0;
    this.setData({
      currentActiveTab
    })
  }
})