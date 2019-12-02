/**
 * 将 params 对象转化为 get 字符串形式
 * @param {*} params
 */
function _dealParams(params) {
  if (
    Object.prototype.toString.call(params) != "[object Object]" &&
    !Object.keys(params).length
  ) {
    return "";
  }
  let arr = [];
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      arr.push(`${key}=${value}`);
    }
  }
  const res = `?${arr.join("&")}`;
  return res;
}

function request({
  url = "",
  data = {},
  method = "POST",
  header = {
    "content-type": "application/json" // 默认值
  }
}) {
  return new Promise(async (resolve, reject) => {
    let requestObj = {};
    if (method == "GET") {
      url += _dealParams(data);
      requestObj = {
        url,
        method: "GET"
      };
    } else if (method == "POST") {
      requestObj = {
        url,
        data,
        method: "post"
      };
    }
    requestObj = {
      ...requestObj,
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    };
    wx.request(requestObj);
  });
}

module.exports = request;
