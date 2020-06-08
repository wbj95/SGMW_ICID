//快递鸟电商ID，登录用户账号查看
//http://kdniao.com/
var CusBase64 = require('base64.js');
var MD5 = require('MD5.js');
const EBusinessID='1292319';
const AppKey ='cbcc5e4d-fda1-4b3e-a524-2d7a6f96b286';

const ReqURL = "https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx";
const errorinfo='服务器有点忙，请您稍后再试';

function getDisplayData(jsonData)
{
  var length = jsonData.length;
 //var jsonData = JSON.stringify(Data);  
 var head='-->';
 var head2='...';
 var line='___________________________';
 var data='';
 if (jsonData.length==0)
   return '该单号暂无物流进展，请稍后再试，或检查公司和单号是否有误。';
 for (var i = length-1;i>=0;i--)
 {
   data += (head + jsonData[i].AcceptStation+'\r\n');
   data += (head2 + jsonData[i].AcceptTime + '\r\n');
   data += (line + '\r\n');
 } 
 return data;
}
function queryExpress(expname,expCode, expNo,object) {
  var requestData = { 'ShipperCode': expCode, 'LogisticCode': expNo};
  var dataSign = encrypt(requestData);
  wx.request({
    url: ReqURL,
    data: {
      RequestData: JSON.stringify(requestData),
      EBusinessID: EBusinessID,
      RequestType: '1002',
      DataSign: dataSign,
      DataType: "2"
    },    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (result) {

      var str_data='';
      var text_data='';
      var jsonData = result.data.Traces;
      if (result.data.Success==true){
          str_data = '运营商--' + expname + ' \n ' + '运单号--' + expNo;
          text_data = getDisplayData(jsonData);
      }else{
        text_data='暂不支持此查询语句，\r\n您可以输入:\r\n---查询顺丰快递123456';
      }
      object.setData({
        expresshead: str_data, 
        text: text_data
      })
      console.log('查询物流的有效数据:', result.data);
    },

    fail: function ({errMsg}) {
      console.log('查询物流失败:', errMsg)
      object.setData({
        expresshead: '',
        text: errorinfo 
      })
    }
  })

}
//先进行MD5，然后Base64，最后UTF-8编码，wx.request本身会进行编码，因此此步骤省略
function encrypt(content) {
  return CusBase64.CusBASE64.encoder(MD5.md5(JSON.stringify(content) + AppKey));
}


function queryEXPbyNum(expNo, object) {
  var requestData = { 'LogisticCode': expNo };
  var dataSign = encrypt(requestData);
  wx.request({
    url: ReqURL,
    data: {
      RequestData: JSON.stringify(requestData),
      EBusinessID: EBusinessID,
      RequestType: '2002',
      DataSign: dataSign,
      DataType: "2"
    }, header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (result) {

      var data = result.data.Shippers;
      var jsonData = JSON.stringify(data);
      console.log('快递code', result.data);
      console.log('Code success data', result.data);
      if (data != null && data[0] != null) {
       //如果有多个对应的快递编号，则提供前6个让客户选择
        if (data.length>1){
          var codelist=[];
          for (var i = 0; i < data.length;i++){
            if (i>=6)
            break;
            codelist[i] = data[i].ShipperName;
          }
          wx.showActionSheet({
            itemList: codelist,
            itemColor: '#dd7e6b',
            success: function (res) {
              if (res.tapIndex != null) {
                var code = data[res.tapIndex].ShipperCode;
                var expname = data[res.tapIndex].ShipperName;
                queryExpress(expname, code, expNo, object);
              }
              console.log(res.tapIndex)
            },
            fail: function (res) {
              console.log(res.errMsg)
            }
          })

        }else{ 
          //如果只有一个，则直接查询
          queryExpress(data[0].ShipperName, data[0].ShipperCode, expNo, object);
        }      
      }else{
        var str_data='';
        var text_data = '该查询语句不支持，或者没有此快递公司。您可以尝试输入:\r\n---查询顺丰快递123456';
        object.setData({
          expresshead: str_data,
          text: text_data,
          searchinput:''
        })
      }
    },

    fail: function ({errMsg}) {
      console.log('快递code request fail', errMsg)
      
      object.setData({
        expresshead: '',
        text: errorinfo,
        searchinput: ''
      })
    }
  })

}
module.exports = {
  queryExpress: queryExpress,
  queryEXPbyNum: queryEXPbyNum
}