const { getSongUrlApi } = require('../api/api.js');
const app = getApp();
module.exports = Behavior({
  methods: {
    /**
     * 播放当前音乐
     */
    async playMusic(e) {
      console.log(
        "========= 添加音乐 前 的播放列表 =========",
        app.globalData.musicData.playList
      );
      try {
        const index = e.currentTarget.dataset.index; // 列表播放，歌曲的索引
        const targetMusic = this.data.list[index]; // 目标音乐
        const id = targetMusic.id; // 音乐 id
        const { url } = await this.getSongUrl(id); // 获取歌曲播放的 url
        // 设置播放器属性：歌名、播放的 url、封面
        app.globalData.audioContext.title =
          targetMusic.name || targetMusic.songName;
        app.globalData.audioContext.src = url;
        let musicInfo = {
          id,
          url,
          songName: targetMusic.name || targetMusic.songName
        };
        console.log(
          "========= 播放当前音乐，音乐播放信息 =========",
          targetMusic
        );
        if (targetMusic.hasOwnProperty("ar") && targetMusic.ar[0]) {
          console.log("推荐列表点击播放");
          
          // 推荐列表点击播放
          musicInfo = {
            ...musicInfo,
            singer: targetMusic.ar[0].name,
            coverImgUrl: targetMusic.al.picUrl
          };
        } else if (!targetMusic.hasOwnProperty("ar") && targetMusic.hasOwnProperty('artists')) {
          console.log("搜索页面");

          // 搜索页面
          musicInfo = {
            ...musicInfo,
            singer: targetMusic.artists[0].name,
            coverImgUrl: targetMusic.artists[0].img1v1Url
          };
        } else if (!targetMusic.hasOwnProperty("ar") && !targetMusic.hasOwnProperty('artists')) {
          console.log("我的主页：最近播放 喜欢音乐 点击播放");

          // 我的主页：最近播放 喜欢音乐 点击播放
          musicInfo = {
            ...musicInfo,
            singer: targetMusic.singer,
            coverImgUrl: targetMusic.coverImgUrl
          };
        }
        const currentPage = getCurrentPages(); // 获取当前页面的路由路径
        if (currentPage[0].is != "pages/index/index") {
          // 非个人页面的播放，添加歌曲到播放列表
          console.log(
            "========= 当前页面的路由路径 =========",
            getCurrentPages()
          );
          // 根据 id 去重
          const idx = app.globalData.musicData.playList.findIndex(item => item.id == id);
          if (idx != -1) {
            app.globalData.musicData.playList.splice(idx, 1);
          }
          app.globalData.musicData.playList.unshift(musicInfo); // 添加到音乐播放列表队列的队头
        }
        console.log(
          "========= 添加音乐 后 的播放列表 =========",
          app.globalData.musicData.playList
        );
        app.globalData.audioContext.play(); // 播放音乐
        app.globalData.musicPlayer = {
          ...app.globalData.musicPlayer,
          ...musicInfo
        };
        // 歌曲播放页面的歌词播放位置（恢复默认位置）
        wx.setStorageSync(
          "lyric",
          JSON.stringify({
            currentTime: "",
            timeOffset: "",
            toViewId: "L0"
          })
        );
        this.triggerEvent("playMusic", id);
      } catch (error) {
        console.error("获取歌曲 URL 出错", error);
        wx.showToast({
          title: "获取歌曲信息出错",
          icon: "none",
          duration: 2000
        });
      }
    },
    /**
     * 添加到音乐列表
     */
    async addMusicToList(e) {
      try {
        const index = e.currentTarget.dataset.index;
        const targetMusic = this.data.list[index];
        const id = targetMusic.id; // 音乐 id
        const { url } = await this.getSongUrl(id);
        let musicInfo = {
          id,
          url,
          songName: targetMusic.name || targetMusic.songName
        };
        console.log(
          "========= 添加到音乐列表，音乐播放信息 =========",
          musicInfo
        );
        if (targetMusic.ar && targetMusic.ar[0]) {
          // 推荐列表点击播放
          musicInfo = {
            ...musicInfo,
            singer: targetMusic.ar[0].name,
            coverImgUrl: targetMusic.al.picUrl
          };
        } else if (!targetMusic.hasOwnProperty("ar")) {
          // 我的主页：最近播放 喜欢音乐 点击播放
          musicInfo = {
            ...musicInfo,
            singer: targetMusic.singer,
            coverImgUrl: targetMusic.coverImgUrl
          };
        } else {
          // 其他情况
          musicInfo = {
            ...musicInfo,
            singer: targetMusic.artists[0].name,
            coverImgUrl: targetMusic.artists[0].img1v1Url
          };
        }
        // 查找是否已存在于播放列表中
        const idx = app.globalData.musicData.playList.findIndex(item => item.id == id);
        if (idx != -1) {
          // wx.showToast({
          //   title: "歌曲已存在",
          //   icon: "none",
          //   duration: 2000
          // });
          app.globalData.musicData.playList.splice(idx, 1);
          wx.showToast({
            title: "已移除",
            icon: "success",
            duration: 2000
          });
        } else {
          url && app.globalData.musicData.playList.push(musicInfo); // 添加到音乐播放列表队列的队头
          wx.showToast({
            title: "已添加",
            icon: "success",
            duration: 2000
          });
        }
      } catch (error) {
        console.error("添加到音乐列表", error);
        wx.showToast({
          title: "获取歌曲信息出错",
          icon: "none",
          duration: 2000
        });
      }
    },
    /**
     * 添加到喜欢列表
     */
    async addMusicToLike(e) {
      try {
        const index = e.currentTarget.dataset.index;
        const targetMusic = this.data.list[index];
        const id = targetMusic.id; // 音乐 id
        const { url } = await this.getSongUrl(id);
        console.log("添加音乐到喜欢列表 musicData", url);
        let musicInfo = {
          id,
          url,
          songName: targetMusic.name || targetMusic.songName
        };
        console.log(
          "========= 添加到喜欢列表，音乐播放信息 =========",
          musicInfo
        );
        if (targetMusic.ar && targetMusic.ar[0]) {
          // 推荐列表点击播放
          musicInfo = {
            ...musicInfo,
            singer: targetMusic.ar[0].name,
            coverImgUrl: targetMusic.al.picUrl
          };
        } else if (!targetMusic.hasOwnProperty("ar")) {
          // 我的主页：最近播放 喜欢音乐 点击播放
          musicInfo = {
            ...musicInfo,
            singer: targetMusic.singer,
            coverImgUrl: targetMusic.coverImgUrl
          };
        } else {
          // 其他情况
          musicInfo = {
            ...musicInfo,
            singer: targetMusic.artists[0].name,
            coverImgUrl: targetMusic.artists[0].img1v1Url
          };
        }
         // 查找是否已存在于播放列表中
         const idx = app.globalData.musicData.likeList.findIndex(item => item.id == id);
         if (idx != -1) {
          //  wx.showToast({
          //    title: "歌曲已存在",
          //    icon: "none",
          //    duration: 2000
          //  });
           app.globalData.musicData.likeList.splice(idx, 1);
           wx.showToast({
            title: "已移除",
            icon: "success",
            duration: 2000
          });
          this.triggerEvent('changeLikeIconStatus', {
            index,
            type: 'unlike'
          });
         } else {
           url && app.globalData.musicData.likeList.push(musicInfo); // 添加到喜欢列表队列的队头
           wx.showToast({
             title: "已添加",
             icon: "success",
             duration: 2000
           });
           this.triggerEvent('changeLikeIconStatus', {
             index,
             type: 'like'
           });
         }
        //  console.log("changeLikeIconStatuschangeLikeIconStatuschangeLikeIconStatuschangeLikeIconStatus == trigger");
        //  this.triggerHandler(index);
      } catch (error) {
        console.error("添加到喜欢列表", error);
        wx.showToast({
          title: "获取歌曲信息出错",
          icon: "none",
          duration: 2000
        });
      }
    },
    /**
     * 删除喜欢列表中的音乐
     */
    deleteMusicFromList(e) {
      const index = e.currentTarget.dataset.index;
      console.log("deleteMusic", index);
      this.triggerEvent('deleteMusic', index)
    },
    /**
     * 获取音乐 URL
     */
    async getSongUrl(id) {
      if (!id) return "";
      try {
        const res = await getSongUrlApi({
          id
        });
        return res.data.data[0];
      } catch (error) {
        console.error(error);
      }
    },
    // /**
    //  * 更改图标
    //  * @param {*} index 
    //  */
    // changeLikeIcon(index) {
    //   console.log("index", index);
    //   const currentPage = getCurrentPages(); // 获取当前页面的路由路径
    //   if (currentPage[0].is == "pages/index/index") { // 个人页面
    //     console.log("this.data.playList", this.data.playList);
        
    //     const playList = this.data.playList;
    //     playList[index].buttons = [{
    //       type: 'like',
    //       text: '普通',
    //       extClass: 'test',
    //       src: '../static/icons/recent_play/liked.png' // icon的路径
    //     }, {
    //       type: 'delete',
    //       text: '警示',
    //       extClass: 'test',
    //       src: '../static/icons/recent_play/delete.png' // icon的路径
    //     }];
    //     this.setData({
    //       playList
    //     })
    //     console.log("this.data.playList111111", this.data.playList);

    //   }
    // },
  }
});