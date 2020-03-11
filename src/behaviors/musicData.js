const app = getApp();
module.exports = Behavior({
  data: {
    musicInfo: {
      songName: '',
      singer: '',
      status: 'off',
      id: '',
      coverImgUrl: ''
    }
  },
  methods: {
    getMusicData() {
      this.setData({
        musicInfo: {
          songName: app.globalData.musicPlayer.songName,
          singer: app.globalData.musicPlayer.singer,
          status: app.globalData.musicPlayer.status,
          id: app.globalData.musicPlayer.id,
          coverImgUrl: app.globalData.musicPlayer.coverImgUrl
        }
      })
    }
  }
})