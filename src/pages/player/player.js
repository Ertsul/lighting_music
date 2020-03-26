import { getLyricApi } from "../../api/api.js";

const app = getApp();

const [
  RECYCLE_LIST_PLAY, // 列表循环
  RECYCLE_ONE_PLAY, // 单曲循环
  RANDOM_PLAY // 随机播放
] = [0, 1, 2];

Page({
  data: {
    lyric: "",
    lyricList: [],
    cacheIndex: 0,
    currentIndex: 0,
    offsetTop: 0,
    lastIndex: 0,
    timeOffset: 0,
    id: "",
    cacheLyricIdx: 0,
    cacheLyricOffset: 0,
    currentTime: "00:00",
    pointPercent: 0,
    listPlayType: RECYCLE_LIST_PLAY,
    ifShowLyric: false,
    cacheIndex: -1,
    toViewId: "L0"
  },
  async onLoad(options) {
    console.log(":::: Player Page onload", options);
    this.setData({
      id: options.id
    });
  },
  async onShow() {
    let cacheLyric = wx.getStorageSync("lyric");
    let timeOffset = 0;
    let toViewId = "L0";
    if (cacheLyric) {
      cacheLyric = JSON.parse(cacheLyric);
      toViewId = cacheLyric.toViewId;
    }
    const duration = this.formatTime(
      app.globalData.audioContext.duration
    ).slice(0, 5);
    this.setData({
      musicInfo: {
        songName: app.globalData.musicPlayer.songName,
        singer: app.globalData.musicPlayer.singer,
        status: app.globalData.musicPlayer.status,
        id: app.globalData.musicPlayer.id,
        coverImgUrl: app.globalData.musicPlayer.coverImgUrl
      },
      duration,
      toViewId,
      timeOffset
    });
    await this.getLyric(this.data.id);
    await this.formatLyric();
    this.musicEndHandler();
    this.musicTimeUpdateHandler();
  },
  onHide() {
    wx.setStorageSync(
      "lyric",
      JSON.stringify({
        currentTime: this.data.currentTime,
        timeOffset: this.data.timeOffset,
        toViewId: this.data.toViewId
      })
    );
  },
  async getLyric(id) {
    try {
      const res = await getLyricApi({
        id
      });
      this.setData({
        lyric: res.data.lrc && res.data.lrc.lyric ? res.data.lrc.lyric : ""
      });
    } catch (error) {
      console.error(error);
    }
  },
  async musicEndHandler() {
    app.globalData.audioContext.onEnded(async () => {
      this.changeSong();
    });
  },
  /**
   * 监听音频播放进度更新事件
   */
  musicTimeUpdateHandler() {
    app.globalData.audioContext.onTimeUpdate(() => {
      let obj = this.formatTime1(app.globalData.audioContext.currentTime);
      let str = `${obj.m}:${obj.s}`;
      const durationArr = this.data.duration.split(":");
      if (str >= this.data.currentTime) {
        // 时间进度条
        this.setData({
          currentTime: str,
          timeOffset:
            560 *
            (Math.round(Number(obj.m) * 60 + Number(obj.s)) /
              Math.round(Number(durationArr[0]) * 60 + Number(durationArr[1])))
        });
      }
      for (let i = 0; i < this.data.lyricList.length; i++) {
        const item = this.data.lyricList[i];
        if (item.time.split(".")[0] == str) {
          if (this.data.currentIndex != i) {
            let offsetTop = 0;
            offsetTop =
              this.data.offsetTop -
              (item.text.length > 42
                ? Math.round(item.text.length / 42) * 70
                : 70);
            this.setData({
              currentIndex: i,
              offsetTop,
              lastIndex: item.time.split(".")[0],
              toViewId: item.id
            });
            app.globalData.musicPlayer.lyric.currentIndex = i;
            app.globalData.musicPlayer.lyric.offsetTop = offsetTop;
            break;
          }
        }
      }
    });
  },
  formatLyric() {
    let lyric = this.data.lyric;
    let lyricList = lyric.split("[").reduce((prev, cur, idx) => {
      const curArr = cur.split("]");
      const time = curArr[0];
      const text = curArr[1];
      prev.push({
        time,
        text: text && text.trim() ? text.trim() : text,
        id: "L" + idx
      });
      return prev;
    }, []);
    if (lyricList.length) {
      for (let k = 0; k < 5; k++) {
        lyricList.push({
          text: "\n",
          time: "",
          id: "L" + (lyricList.length + 1)
        });
      }
    }
    this.setData({
      lyricList
    });
  },
  repairZero(num) {
    return num < 10 ? "0" + num : num;
  },
  formatTime1(total) {
    let h = this.repairZero(Math.floor(total / 3600));
    let m = this.repairZero(Math.floor((total - h * 3600) / 60));
    let s = this.repairZero(Math.floor(total - h * 3600 - m * 60));
    return { h, m, s };
  },
  formatTime(time) {
    let min = Math.floor(time / 60);
    min = min < 10 ? `0${min}` : min;
    let second = (time % 60) * 10;
    second = second < 10 ? `0${second.toFixed(2)}` : second.toFixed(2);
    return `${min}:${second}` == "00:00" ? "" : `${min}:${second}`;
  },
  navigateBack() {
    let lyric = {
      currentTime: this.data.currentTime,
      timeOffset: this.data.timeOffset,
      toViewId: this.data.toViewId
    };
    if (app.globalData.musicPlayer.status == "end") {
      lyric = {
        offsetTop: 0,
        currentIndex: 0,
        currentTime: 0,
        timeOffset: 0
      };
    }
    wx.setStorageSync("lyric", JSON.stringify(lyric));
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 切换音乐播放状态
   */
  changePlayStatus() {
    if (app.globalData.musicPlayer.status == "off") {
      app.globalData.audioContext.play();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        status: "on"
      };
      const musicInfo = {
        ...this.data.musicInfo,
        status: "on"
      };
      this.setData({
        musicInfo
      });
    } else {
      app.globalData.audioContext.pause();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        status: "off"
      };
      const musicInfo = {
        ...this.data.musicInfo,
        status: "off"
      };
      this.setData({
        musicInfo
      });
    }
  },
  /**
   * 切换歌曲 上一首 下一首
   * @param {*} e
   */
  async changeSong(e) {
    let type = "next";
    if (e) {
      type = e.currentTarget.dataset.type;
    }
    if (app.globalData.musicPlayer.listPlayType == RECYCLE_LIST_PLAY) {
      // 列表循环
      let { playList = [], index = 0 } = app.globalData.musicData;
      if (!playList.length) {
        return;
      }
      if (type == "prev") {
        // 上一首
        if (index == 0) {
          console.log("播放到第一首");
          index = playList.length - 1;
        } else {
          index = index - 1;
        }
      } else {
        // 下一首
        if (index == playList.length - 1) {
          console.log("播放到最后一首");
          index = 0;
        } else {
          index = index + 1;
        }
      }

      app.globalData.audioContext.stop();
      app.globalData.musicData.index = index;
      app.globalData.audioContext.src = playList[index].url;
      app.globalData.audioContext.title = playList[index].songName;
      await this.getLyric(playList[index].id);
      await this.formatLyric();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        songName: playList[index].songName,
        singer: playList[index].singer,
        id: playList[index].id,
        coverImgUrl: playList[index].coverImgUrl
      };
      this.setData({
        musicInfo: {
          songName: app.globalData.musicPlayer.songName,
          singer: app.globalData.musicPlayer.singer,
          status: "on",
          id: app.globalData.musicPlayer.id,
          coverImgUrl: app.globalData.musicPlayer.coverImgUrl
        },
        offsetTop: 0,
        currentIndex: 0,
        cacheIndex: 0,
        duration: this.formatTime(app.globalData.audioContext.duration).slice(
          0,
          5
        ),
        timeOffset: 0,
        currentTime: "00:00"
      });
      setTimeout(() => {
        app.globalData.audioContext.play();
      }, 100);
    } else if (app.globalData.musicPlayer.listPlayType == RECYCLE_ONE_PLAY) {
      // 单曲循环
      this.setData({
        offsetTop: 0,
        currentIndex: 0,
        cacheIndex: 0,
        timeOffset: 0,
        currentTime: "00:00"
      });
      app.globalData.audioContext.stop();
      let { playList = [], index = 0 } = app.globalData.musicData;
      if (!playList.length) {
        return;
      }
      app.globalData.audioContext.stop();
      app.globalData.musicData.index = index;
      app.globalData.audioContext.src = playList[index].url;
      app.globalData.audioContext.title = playList[index].songName;
      this.musicTimeUpdateHandler();
      this.musicEndHandler();
      setTimeout(() => {
        app.globalData.audioContext.play();
      }, 100);
    } else {
      // 随机播放
      let { playList = [] } = app.globalData.musicData;
      if (!playList.length) {
        return;
      }
      const index = this.getRangeNum(0, playList.length - 1);
      app.globalData.audioContext.stop();
      app.globalData.musicData.index = index;
      app.globalData.audioContext.src = playList[index].url;
      app.globalData.audioContext.title = playList[index].songName;
      await this.getLyric(playList[index].id);
      await this.formatLyric();
      app.globalData.musicPlayer = {
        ...app.globalData.musicPlayer,
        songName: playList[index].songName,
        singer: playList[index].singer,
        id: playList[index].id,
        coverImgUrl: playList[index].coverImgUrl,
        status: "on"
      };
      this.setData({
        musicInfo: {
          songName: app.globalData.musicPlayer.songName,
          singer: app.globalData.musicPlayer.singer,
          id: app.globalData.musicPlayer.id,
          coverImgUrl: app.globalData.musicPlayer.coverImgUrl,
          status: "on"
        },
        offsetTop: 0,
        currentIndex: 0,
        cacheIndex: 0,
        timeOffset: 0,
        currentTime: "00:00",
        duration: this.formatTime(app.globalData.audioContext.duration).slice(
          0,
          5
        )
      });
      setTimeout(() => {
        app.globalData.audioContext.play();
      }, 100);
    }
    app.globalData.musicPlayer.lyric = {
      currentIndex: 0,
      list: [],
      offsetTop: 0
    };
  },
  /**
   * 更改歌曲切换模式
   */
  changeListPlayType(e) {
    this.setData({
      listPlayType: e.currentTarget.dataset.type
    });
    app.globalData.musicPlayer.listPlayType = e.currentTarget.dataset.type;
  },
  getRangeNum(min, max) {
    const range = max - min;
    const rand = Math.random();
    return min + Math.round(rand * range);
  },
  changeLyricVisible() {
    this.setData({
      ifShowLyric: !this.data.ifShowLyric
    });
  }
});
