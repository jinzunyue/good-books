// miniprogram/pages/main/main.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLXvU7uWXdaNJtQZ1q9yUu74rTkL6LIbQo9gRXccQfR7twJV8icpDghRxBTQu5ZWyv9Te5cT93Vv0g/132',
    nickname: '金樽月',
    userInfo: {},
    logged: false,
    books: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickname: res.userInfo.nickName,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    onGetOpenid()
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
    // 获取列表
    const db = wx.cloud.database({
      env: 'debug-h9lmq'
    });
    const books = db.collection("books");
    books.get()
      .then(res => {
        console.log("books:" + JSON.stringify(res));
        this.setData({ books: res.data });
      })
      .catch(err => {
        console.log("books:" + JSON.stringify(err));
      })
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

  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickname: e.detail.userInfo.nickName,
        userInfo: e.detail.userInfo
      })
    }
  },

  previewAllImg: function (e) {
    console.log("previewAllImg:" + JSON.stringify(e));
    const imgs = e.target.dataset.imgs;
    console.log("imgs:" + imgs);
    wx.previewImage({
      urls: imgs,
    })
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ',             res.result.openid)
        app.globalData.openid = res.result.openid
        getList()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  getList: function () {
    // 获取列表
    const db = wx.cloud.database({
      env: 'debug-h9lmq'
    });
    const books = db.collection("books");
    books.get()
      .then(res => {
        console.log("books:" + JSON.stringify(res));
        this.setData({ books: res.data });
      })
      .catch(err => {
        console.log("books:" + JSON.stringify(err));
      })
  }
})