const app = getApp();
module.exports = Behavior({
  methods: {
    test() {
      console.log(11111111111111);

    },
    timeUpdate() {
      app.globalData.audioContext.onTimeUpdate(() => {
        console.log("timeupdatetimeupdatetimeupdatetimeupdate");
        let obj = this.formatTime1(app.globalData.audioContext.currentTime);
        let str = `${obj.m}:${obj.s}`;
        let i = this.data.cacheIndex;
        // const durationArr = this.formatTime(app.globalData.audioContext.duration).slice(0, 5).split(':');
        const list = app.globalData.musicPlayer.lyric.list;
        for (i; i < list.length; i++) {
          const item = list[i];
          if (item.time.split('.')[0] == str) {
            if (this.data.currentIndex != i) {
              const reg = /[\n]/gm;
              const offsetTop = this.data.offsetTop - (item.text.match(reg) ? item.text.match(reg).length * 70 : 70);
              app.globalData.musicPlayer.lyric.offsetTop = offsetTop;
              console.log("app.globalData.musicPlayer.lyric.offsetTop", app.globalData.musicPlayer.lyric.offsetTop);

              // this.setData({
              //   currentIndex: i,
              //   offsetTop,
              //   lastIndex: item.time.split('.')[0]
              // })
              break
            }
          }
        }
      })
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
      return `${min}:${second}` == "00:00" ? '' : `${min}:${second}`
    },
    repairZero(num) {
      return num < 10 ? '0' + num : num;
    }
  }
})