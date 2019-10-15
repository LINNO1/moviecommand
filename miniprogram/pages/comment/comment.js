// pages/comment/comment.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetal: {},
    comment: '',
    score: 5,
    imagsList: [],
    fileId: [],
    movieid: -1
  },
  loadMovie: function (movieid) {
    wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name: 'loadDetal',
      data: {
       movieid: movieid
      }
    }).then(res => {
    console.log(res)
      this.setData({
        movieDetal: JSON.parse(res.result)
      })
      console.log(this.data.movieDetal);
      wx.hideLoading();
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
    })

  },
  onCommentChange: function(e){
    console.log(e);
    this.setData({
      comment: e.detail
    })
  },
  onScoreChange: function (e) {
    console.log(e);
    this.setData({
      score: e.detail
    })
  },
  //上传照片
  uploadImag: function(e){
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res=> {
        const tempFilePaths = res.tempFilePaths;
        console.log('tempFilePaths: ', tempFilePaths);
        this.setData({
          imagsList: tempFilePaths
        })
      },
      fail: err=>{
        console.log(err)

      }
    })
  },
  submit: function(e){
         console.log(this.data.score,this.data.comment);
         wx.showLoading({
            title: '上传中',
         })

         //将照片传到云存储
         let promiseArr=[];
         for(let i=0;i<this.data.imagsList.length;i++){
           promiseArr.push(new Promise((resolve,reject)=>{
             var imag = this.data.imagsList[i];
             var affix = /\.\w+$/.exec(imag)[0]; //提取图片后缀
             console.log(affix);
         
             wx.cloud.uploadFile({
               cloudPath: new Date().getTime()+affix,
               filePath: imag, // 文件路径
               success: res => {
                 // get resource ID
                 console.log(res.fileID);
                 this.setData({
                   fileId: this.data.fileId.concat(res.fileID)
                 })
               },
               fail: err => {
                 console.log(err)
               }
             })
          }))
          
         }

         Promise.all(promiseArr).then(res=>{
           db.collection('moviecomment').add({
         
             data: {
               comment: this.data.comment,
               score: this.data.score,
               movieid: this.data.movieid,
               fileId: this.data.fileId
             },
             success: res=>{
               console.log('11111111111')
               // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id       
               wx.hideLoading();
               wx.showToast({
                 title: '评价成功'           
              
               })
             },
             fail: err=>{
               wx.hideLoading();
               wx.showToast({
                 title: '评价失败'
               })
             }
           })

         })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      movieid: options.movieid
    })
    this.loadMovie(options.movieid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})