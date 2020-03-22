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
      console.log("ididiid", id);
      const {
        url
      } = await this.getSongUrl(id);
      console.log("播放当前音乐 musicData", url, targetMusic);
      // 设置播放器属性
      app.globalData.audioContext.src = url;
      app.globalData.musicPlayer.natualPlay = false; // 用户点点击
      let musicInfo = {
        id,
        url,
        songName: targetMusic.name || targetMusic.name
      }
      if (targetMusic.ar && targetMusic.ar[0]) {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.ar[0].name,
          coverImgUrl: targetMusic.al.picUrl
        }
      } else {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.artists[0].name,
          coverImgUrl: targetMusic.artists[0].img1v1Url
        }
      }
      // const musicInfo = {
      //   id,
      //   url,
      //   singer: targetMusic.ar[0].name || targetMusic.artists[0].name,
      //   coverImgUrl: targetMusic.al.picUrl || targetMusic.artists[0].img1v1Url
      // };
      if (app.globalData.musicData.playList && app.globalData.musicData.playList.length > 0) {
        app.globalData.musicData.playList.splice(app.globalData.musicData.index, 0, musicInfo)
        app.globalData.musicData.index = app.globalData.musicData.index;
      } else {
        app.globalData.musicData.index = 0;
        app.globalData.musicData.playList.push(musicInfo);
      }
      app.globalData.audioContext.play();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        ...musicInfo
        // id,
        // url,
        // songName: targetMusic.name || targetMusic.name,
        // singer: targetMusic.ar[0].name || targetMusic.artists[0].name,
        // coverImgUrl: targetMusic.al.picUrl || targetMusic.artists[0].img1v1Url
      }
      // 歌曲播放页面的歌词播放位置（恢复默认位置）
      wx.setStorageSync('lyric', JSON.stringify({
        offsetTop: 0,
        currentIndex: 0
      }));
      this.triggerEvent('playMusic');
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
        songName: targetMusic.name || targetMusic.name
      }
      if (targetMusic.ar && targetMusic.ar[0]) {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.ar[0].name,
          coverImgUrl: targetMusic.al.picUrl
        }
      } else {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.artists[0].name,
          coverImgUrl: targetMusic.artists[0].img1v1Url
        }
      }
      url && app.globalData.musicData.playList.push(musicInfo);
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
        songName: targetMusic.name || targetMusic.name
      }
      if (targetMusic.ar && targetMusic.ar[0]) {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.ar[0].name,
          coverImgUrl: targetMusic.al.picUrl
        }
      } else {
        musicInfo = {
          ...musicInfo,
          singer: targetMusic.artists[0].name,
          coverImgUrl: targetMusic.artists[0].img1v1Url
        }
      }
      url && app.globalData.musicData.likeList.push(musicInfo);
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