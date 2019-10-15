// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return rp(`https://douban.uieee.com/v2/movie/in_theaters?start=${event.start}&count=${event.count}`)
    .then(function (res) {
      console.log(res)
      return res;
      
    })
    .catch(function (err) {
      // Crawling failed...
      console.log(err)
    });
  
}