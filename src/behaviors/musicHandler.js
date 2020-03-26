const { getSongUrlApi } = require('../api/api.js');
const app = getApp();
module.exports = Behavior({
  behaviors: [],
  properties: {
    myBehaviorProperty: {
      type: String
    }
  },
  data: {
    myBehaviorData: {}
  },
  attached: function () { },
  methods: {
    /**
     * 播放当前音乐
     */
    async playMusic(e) {
      const index = e.currentTarget.dataset.index;
      const targetMusic = this.data.list[index];
      const id = targetMusic.id; // 音乐 id
      console.log("播放当前音乐 ididiid", id);
      const {
        url
      } = await this.getSongUrl(id);
      console.log("播放当前音乐 musicData", url, targetMusic);
      // 设置播放器属性
      app.globalData.audioContext.title = targetMusic.name || targetMusic.songName;
      app.globalData.audioContext.src = url;
      app.globalData.musicPlayer.natualPlay = false; // 用户点点击
      let musicInfo = {
        id,
        url,
        songName: targetMusic.name || targetMusic.songName
      }
      console.log("targetMusic",targetMusic);
      if (targetMusic.hasOwnProperty('ar') && targetMusic.ar[0]) {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.ar[0].name,
          coverImgUrl: targetMusic.al.picUrl
        }
      } else if (!targetMusic.hasOwnProperty('ar')) {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.singer,
          coverImgUrl: targetMusic.coverImgUrl
        }
      } else {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.artists[0].name,
          coverImgUrl: targetMusic.artists[0].img1v1Url
        }
      }
      console.log("app.globalData.musicData.playList", app.globalData.musicData.playList);
      const currentPage = getCurrentPages();
      if (currentPage[0].is != 'pages/index/index') {
        console.log(getCurrentPages());
        if (app.globalData.musicData.playList && app.globalData.musicData.playList.length > 0) {
          app.globalData.musicData.playList.splice(app.globalData.musicData.index, 0, musicInfo)
          app.globalData.musicData.index = app.globalData.musicData.index;
        } else {
          app.globalData.musicData.index = 0;
          app.globalData.musicData.playList.push(musicInfo);
        }
      }
      app.globalData.audioContext.play();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        ...musicInfo,
      }
      wx.setStorageSync(
        "lyric",
        JSON.stringify({
          currentTime: '',
          timeOffset: '',
          toViewId: 'L0'
        })
      );
      // 歌曲播放页面的歌词播放位置（恢复默认位置）
      this.triggerEvent('playMusic', id);
    },
    /**
     * 添加音乐到音乐列表
     */
    async addMusicToList(e) {
      const index = e.currentTarget.dataset.index;
      const targetMusic = this.data.list[index];
      const id = targetMusic.id; // 音乐 id
      const {
        url
      } = await this.getSongUrl(id);
      console.log("添加音乐到音乐列表 musicData", url);
      let musicInfo = {
        id,
        url,
        songName: targetMusic.name || targetMusic.songName
      }
      if (targetMusic.ar && targetMusic.ar[0]) {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.ar[0].name,
          coverImgUrl: targetMusic.al.picUrl
        }
      } else if (!targetMusic.hasOwnProperty('ar')) {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.singer,
          coverImgUrl: targetMusic.coverImgUrl

        }
      } else {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.artists[0].name,
          coverImgUrl: targetMusic.artists[0].img1v1Url
        }
      }
      url && app.globalData.musicData.playList.push(musicInfo);
      wx.showToast({
        title: '已加到播放列表',
        icon: 'success',
        duration: 2000
      })
    },
    /**
     * 添加音乐到喜欢列表
     */
    async addMusicToLike(e) {
      const index = e.currentTarget.dataset.index;
      const targetMusic = this.data.list[index];
      const id = targetMusic.id; // 音乐 id
      const {
        url
      } = await this.getSongUrl(id);
      console.log("添加音乐到喜欢列表 musicData", url);
      let musicInfo = {
        id,
        url,
        songName: targetMusic.name || targetMusic.songName
      }
      if (targetMusic.ar && targetMusic.ar[0]) {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.ar[0].name,
          coverImgUrl: targetMusic.al.picUrl
        }
      } else if (!targetMusic.hasOwnProperty('ar')) {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.singer,
          coverImgUrl: targetMusic.coverImgUrl

        }
      } else {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.artists[0].name,
          coverImgUrl: targetMusic.artists[0].img1v1Url
        }
      }
      url && app.globalData.musicData.likeList.push(musicInfo);
      wx.showToast({
        title: '已加到喜欢列表',
        icon: 'success',
        duration: 2000
      })
    },
    /**
     * 删除喜欢列表中的音乐
     */
    deleteMusicFromList() {
      console.log("deleteMusicFromList");
    },
    /**
     * 获取音乐 URL
     */
    async getSongUrl(id) {
      if (!id) return '';
      try {
        const res = await getSongUrlApi({
          id
        });
        return res.data.data[0];
      } catch (error) {
        console.error(error);
      }
    }
  }
})