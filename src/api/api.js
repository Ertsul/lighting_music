const request = require("../http/request");
const baseConfig = require("../http/baseConfig");

// get 例子
const getList = params =>
  request({
    method: "GET",
    url: baseConfig.baseUrl + "/list",
    data: params
  });

// post 例子
const updateInfo = params =>
  request({
    method: "POST",
    url: baseConfig.baseUrl + "/updateInfo",
    data: params
  });

// 手机登录
const loginApi = params =>
  request({
    method: "GET",
    url: baseConfig.baseUrl + "/login/cellphone",
    data: params
  });

// 获取歌单 ( 网友精选碟 )
const getHotListApi = (params = {}) =>
  request({
    method: "GET",
    url: baseConfig.baseUrl + "/top/playlist",
    data: params
  });

// 获取歌单详情
const getSongSheetDetailApi = (params = {}) =>
  request({
    method: "GET",
    url: baseConfig.baseUrl + "/playlist/detail",
    data: params
  });

// 获取音乐 url
const getSongUrlApi = (params = {}) =>
request({
  method: "GET",
  url: baseConfig.baseUrl + "/song/url",
  data: params
});

module.exports = {
  getList,
  updateInfo,
  getHotListApi,
  getSongSheetDetailApi,
  getSongUrlApi
};
