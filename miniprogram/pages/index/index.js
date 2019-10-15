// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movielist: []

  },
  //调用云函数，http加载豆瓣电影信息
 loadMovie: function(){
   wx.showLoading({
     title: '加载中'
   })
   wx.cloud.callFunction({
     name: 'loadmovie',
     data: {
       start: this.data.movielist.length,
       count: 5
     }
   }).then(res => {
     
     this.setData({
       movielist: this.data.movielist.concat(JSON.parse(res.result).subjects)
     })
     console.log(this.data.movielist);
     wx.hideLoading();
   }).catch(err => {
     console.log(err);
     wx.hideLoading();
   })
   
   },
   //跳转到详情
gotocomment: function(event){
  //保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层
  wx.navigateTo({
    //取出button中 data-movieid的
    url: `../comment/comment?movieid=${event.target.dataset.movieid}`,
    success: res=>{
       console.log(res)
    },
     fail:err=>{ 
       console.log(err)
    }
  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.loadMovie();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {




  },

  /**
   *   
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    this.loadMovie();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})