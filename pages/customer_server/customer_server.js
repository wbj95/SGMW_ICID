// pages/customer_server/customer_server.js
var app = getApp()
var MD5 = require('../../utils/MD5.js');
var GUID = require('../../utils/GUID.js');
var queryExpress = require('../../utils/queryExpress.js');
var config = require('../../libs/config.js');
//OLAMI自然语言处理接口
const requestUrl = "https://cn.olami.ai/cloudservice/api";
//聊天API
const Appkey = "39ef23d4577740879a2516e464d97e9f";
const Appsecret = "0c79e48e753b4c138ab923fe5cef8434";
const api = "nli";
var userId = GUID.NewGuid();
const plugin = requirePlugin("WechatSI")

// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()

//API访问失败等不正常情况的提示
const API_data_error = '亲爱的，估计服务器罢工了，快联系我主人吧。';
const API_Fail = '我崩溃了，您待会再来吧';
//查询方式
const search_type = 0x00;
const chat_type = 0x01;
//标题框初始化内容
const titletext_default = '您可以使用自然语言查询知识库，例如输入"故障"，"诊断"等等'
const Chattype_text = '本宝宝支持聊天、新闻、日历、计算、天气、24点和讲笑话哦。试试吧';
const voice="/images/voice.png"
const keyboard = "/images/keyboard.png"
const voice_id = 0x01
const keyboard_id = 0x00
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msglist: [],
    scrollTop: 0,
    inputValue: '', //用于显示输入语句
    text: '', //查询结果显示
    // expresshead: titletext_default, //查询标题显示
    searchinput: '', //用户输入的查询语句
    // buttonValue: searchbuttonvalue_default, //查询按钮的默认值
    isDisableInput: false, //输入框是否可用
    dialogtype: search_type, //工具公式，默认是查询模式
    hyperlinks:[],//超链接
    currentText: '',
    sendStyle: keyboard,//发送类型image
    sendId: keyboard_id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initRecord()
    var that = this
    console.log(app.globalData.username);
    var msg = {
      'type': 1,
      'msg': "您好，欢迎来咨询，您可以使用自然语言查询知识库,例如输入'故障'，'诊断'等等"
    }
    var msglist = this.data.msglist;
    msglist.push(msg);
    that.setData({
      msglist: msglist,
      scrollTop: this.data.scrollTop
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 实时输出用户输入的句子
   */
  acquire_input: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 对应“查询”button
   */
  BeginSearch: function(e) {
    console.log("模式：" + this.data.dialogtype)
    var msg = {
      'type': 0,
      'msg': this.data.inputValue
    };
    //将发送数据存放到list中
    var msglist = this.data.msglist;
    msglist.push(msg);
    //更新视图
    this.setData({
      msglist: msglist

    });
    this.setData({
      searchinput: '',
    })

    //如果是闲聊模式
    if (this.data.dialogtype == 1) {
      this.parseCorpus(this.data.inputValue, this);
    } else {
      this.knowledge(this.data.inputValue, this);
    }


  },
  /**
   * 当用户输入完语句，确认时直接查询
   */
  bindConfirmControl: function(e) {

    var corpus = e.detail.value;
    console.log(corpus)
    var msg = {
      'type': 0,
      'msg': corpus
    };
    //将发送数据存放到list中
    var msglist = this.data.msglist;
    msglist.push(msg);
    //更新视图
    this.setData({
      msglist: msglist

    });
    this.setData({
      searchinput: '',
    })
    //如果是闲聊模式
    if (this.data.dialogtype == 1) {
      this.parseCorpus(this.data.inputValue, this);
    } else {
      this.knowledge(this.data.inputValue, this);
    }
  },

  /**
   * 功能切换，分为聊天和查询两种模式
   */
  switchChange: function(e) {
    var msg
    var that = this
    var msglist = that.data.msglist;


    if (e.detail.value) {
      console.log("222");
      msg = {
        'type': 1,
        'msg': titletext_default
      }
      msglist.push(msg);
      that.setData({
        dialogtype: search_type, //查询知识库模式
        msglist: msglist,
        scrollTop: that.data.scrollTop+100
      })
    } else {
      console.log("333");
      msg = {
        'type': 1,
        'msg': Chattype_text
      }
      msglist.push(msg);
      that.setData({
        dialogtype: chat_type, //闲聊
        msglist: msglist,
        scrollTop: that.data.scrollTop+100
      })
    }

  },

  /**
   * 将输入语句通过post方式提交到OLAMI语义开放平台
   */
  parseCorpus: function(corpus, object) {
    var that = this
    var usekey = Appkey;
    var usesecret = Appsecret;

    //获取sign的MD5值
    object.setData({
      text: '请稍后......'
    })
    var timestamp = new Date().getTime();

    var originalSign = usesecret + "api=" + api + "appkey=" + usekey + "timestamp=" + timestamp + usesecret;
    var sign = MD5.md5(originalSign);

    var rqdata = {
      "data": {
        "input_type": 1,
        "text": corpus
      },
      "data_type": "stt"
    };
    console.log(JSON.stringify(rqdata))
    console.log('\r\n')
    wx.request({
      url: requestUrl,
      data: {
        appkey: usekey,
        api: api,
        timestamp: timestamp,
        sign: sign,
        rq: JSON.stringify(rqdata),
        cusid: userId,
        changebuttoncolor: "#d0e0e3"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(result) {
        var data = result.data.data;
        console.log(data)
        if (result.data != null && result.data.status != null && result.data.status == 'ok') {
          console.log('欧拉蜜有效数据', data.nli[0].desc_obj.result);
          console.log('数据类型', data.nli[0].type);
          var msglist = that.data.msglist;
          var msg = {
            'type': 1,
            'msg': data.nli[0].desc_obj.result
          }
          msglist.push(msg);
          that.setData({
            msglist: msglist,
            scrollTop: that.data.scrollTop + 1000
          });


          //如果是闲聊就只显示闲聊内容
          if (data.nli[0].type == 'nonsense') {

          } else if (data.nli[0].type == 'joke') { //讲笑话
            var msg2 = {
              'type': 1,
              'msg': data.nli[0].data_obj[0].content
            }
          } else if (data.nli[0].type == 'selection') { //多个选择
            var msg3 = ''
            var j = 0;
            console.log(data.nli[0].data_obj[8].title)
            for (var i = 0; i < data.nli[0].data_obj.length; i++) {
              j = j + 1;
              var tempTitle = data.nli[0].data_obj[i].title
              var tmag = j + "." + tempTitle + ' \n'
              msg3 = msg3 + tmag
            }

            var msg2 = {
              'type': 1,
              'msg': msg3
            }
          } else if (data.nli[0].type == 'news') { //选中了第几条
            var msg2 = {
              'type': 1,
              'msg': data.nli[0].data_obj[0].detail
            }
          }

          msglist.push(msg2);
          that.setData({
            msglist: msglist,
            scrollTop: that.data.scrollTop + 1000
          });

        } else {
          console.log('欧拉蜜返回失败', result.data.status);
          object.setData({
            text: API_data_error
          })
        }
      },

      fail: function({
        errMsg
      }) {
        console.log('request fail', errMsg)
        object.setData({
          text: API_data_error
        })
      }
    })
  },
  //知识库模式
  knowledge: function(corpus, object) {
    var that=this
    //判断用户回复的是数字还是字符串
    // if (!isNaN(corpus)) {
    //   //是数字,直接访问后台
    //   console.log("用户只回复数字" + corpus);
    //   console.log(wx.getStorageSync(corpus));

    //   wx.request({
    //     url: 'http://dx30403455.zicp.vip/carmanage/CarInfo/findFilesByNum?fileName=' + wx.getStorageSync(corpus),
    //     method: 'GET',
    //     data: {},
    //     header: {
    //       'Accept': 'application/json'
    //     },
    //     success: function(res) {
    //       console.log(res.data.url);
    //       //获取url
    //       var url = res.data.url
    //       //在线预览
    //     that.onlinePreview(url);
    //     }
    //   })
    // } else {
      var that = object
      console.log("知识库模式" + corpus);
      //访问百度人工智能获取关键名词
      //先获取Access Token
      wx.request({
        url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + config.Config.baiduKey + "&client_secret=" + config.Config.baiduSecretKey,
        data: {},
        method: 'GET',
        success: function(res) {
          console.log("鉴权" + res.data.access_token)
          var access_token = res.data.access_token
          //获取词性
          that.lexer(access_token, corpus)
        },
        fail: function(e) {
          console.log(e)
        }
      });
    // }
  },
  //访问百度人工智能自然语言处理
  lexer: function(access_token, corpus) {
    var that = this
    console.log("分词" + access_token + corpus)
    var result = []
    //访问百度人工智能词法分析
    wx.request({
      url: "https://aip.baidubce.com/rpc/2.0/nlp/v1/lexer?access_token=" + access_token + "&charset=UTF-8",
      data: {
        text: corpus
      },
      method: 'POST',
      header: {
        'Content-type': 'application/json'
      },
      success: function(r) {
        console.log(r.data)
        //获取词性
        var c = null
        var ne = null

        //如果是名词就取出来
        for (var i = 0; i < r.data.items.length; i++) {
          c = r.data.items[i].pos
          ne = r.data.items[i].ne
          console.log(r.data.items[i].pos);
          if (c == 'n' || ne == 'ORG' || ne == 'LOC' || ne == 'PER' || c == 'nr' || c == "nz" || c == 'nt' || c == 'ns' || c == "v" || c == "vd") {
            result.push(r.data.items[i].item)
          }
        }
        console.log(result);
        if (result == "") {
          console.log("空值");
          var msglist = that.data.msglist;
          var msg2 = {
            'type': 1,
            'msg': "主人，没有找到合适的答案哦"
          }
          msglist.push(msg2);
          that.setData({
            msglist: msglist,
            scrollTop: that.data.scrollTop + 1000
          });
          
        } else {
          console.log("非空值");
          //调用关键词去查找OSS的相似文件
          that.findFile(result,corpus)
        }
        return result
      },
      fail: function(e) {
        console.log(e)
      }
    })
  },

  //访问后台，将关键词传往后台
  findFile: function(keywords,text) {
    var that = this
    console.log("传入的值")
    console.log(keywords)
    wx.request({
      url: 'https://www.sgmwzhilian.club/carmanage/CarInfo/findFiles',
      data: {
        array: keywords,
        cusid: userId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(r) {
        console.log(r.data.files)
        //如果没有匹配到合适的值
        if (r.data.files.length == 0) {
          //知识库没有找到，那就调用聊天模式吧
          console.log("text"+text)
          that.parseCorpus(text,that);
        } else {
          var hyperlinks = r.data.files
          // var msg3 = '亲爱的主人，找到以下相似的答案，请选择第几项，直接回复数字或点击' + '\n'
          var msg4 = '亲爱的主人，找到以下相似的答案，请选择第几项，直接点击选择' + '\n'
          // var j = 0;
           var msglist = that.data.msglist;
          var msg2 = {
            'type': 2,
            'msg': hyperlinks,
            'msg4': msg4
          }
          msglist.push(msg2);
          that.setData({
            msglist: msglist,
            scrollTop: that.data.scrollTop + 1000,
            hyperlinks: hyperlinks
          });
        }


      }
    })
  },

  //在线预览文档
  onlinePreview:function(url){
    console.log("在线预览"+url)
    //加载中
    wx.showLoading({ title: '正在获取文件', icon: 'loading', duration: 20000 });
    //在线预览文档
    wx.downloadFile({
      url: url,//可以是后台传过来的路径
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            //成功
            console.log("打开文档成功")
            wx.hideLoading()//加载中隐藏
          }
        })
      },
      fail: function (e) {
        console.log("在线预览失败" + e)
      }
    })
  },

  //在线预览文档
  XmLonlinePreview: function (r) {
    console.log("在线预览" + r.currentTarget.dataset.name)
    //加载中
    wx.showLoading({ title: '正在获取文件', icon: 'loading', duration: 20000 });
    //在线预览文档
    wx.downloadFile({
      url: r.currentTarget.dataset.name,//可以是后台传过来的路径
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            //成功
            console.log("打开文档成功")
            wx.hideLoading()//加载中隐藏
          }
        })
      },
      fail: function (e) {
        console.log("在线预览失败" + e)
      }
    })
  },
  //开始录音
  streamRecord: function () {

    manager.start({

      lang: 'zh_CN',

    })
    wx.showToast({
      title: "开始录音",
      icon: 'success',
      image: '/images/start_voice.png',
      duration: 10000,
      success: function (res) {

      },
      fail: function (res) {
        console.log(res);
      }
    });

   },
//结束录音
   endStreamRecord: function () {

    manager.stop()
     wx.hideToast();//结束录音、隐藏Toast提示框

   },
  initRecord: function () {

    //有新的识别内容返回，则会调用此事件

    manager.onRecognize = (res) => {

      let text = res.result

      this.setData({

        currentText: text,

      })

    }

    // 识别结束事件

    manager.onStop = (res) => {

      let text = res.result

      if (text == '') {

        // 用户没有说话，可以做一下提示处理...
        this.showRecordEmptyTip()
        return

      }
      var msg = {
        'type': 0,
        'msg': text
      };
      //将发送数据存放到list中
      var msglist = this.data.msglist;
      msglist.push(msg);
      //更新视图
      this.setData({
        msglist: msglist
      });
      //不为空，调用其他知识库模式
      this.knowledge(text, this);
      this.setData({
        currentText: text,
      })
    }

   },

  /**
  * 识别内容为空时的反馈
  */
  showRecordEmptyTip: function () {
    // this.setData({
    //   recording: false,
    //   bottomButtonDisabled: false,
    // })
    wx.showToast({
      title: "请说话",
      icon: 'success',
      image: '/images/no_voice.png',
      duration: 1000,
      success: function (res) {

      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  exchangeSend: function (e){
    console.log(e.target.id)
    //键盘
    if (e.target.id==0){
      this.setData({
        sendStyle: voice,
        sendId:voice_id
    })
}else{
  //切换成语音
      this.setData({
        sendStyle: keyboard,
        sendId: keyboard_id
      })
}
  }
})