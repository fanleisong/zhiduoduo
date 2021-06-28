// default config
module.exports = {
  port: 8046,
  default_module: 'api',
  weixin: {
    appid: 'wxdefde16ace262c6d', // 小程序 appid
    secret: '4ab38b4b55d020fbc19da8dfe6b02803', // 小程序密钥
    mch_id: '', // 商户帐号ID
    partner_key: '', // 微信支付密钥
    notify_url: '' // 微信异步通知，例：https://www.nideshop.com/api/pay/notify
  },
  express: {
    // 快递物流信息查询使用的是快递鸟接口，申请地址：http://www.kdniao.com/
    appid: '', // 对应快递鸟用户后台 用户ID
    appkey: '', // 对应快递鸟用户后台 API key
    request_url: 'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx'
  },
  resource_on: true, //是否开启静态资源解析功能
  resource_reg: /^(static\/|[^\/]+\.(?!js|html|png)\w+$)/, //判断为静态资源请求的正则
};
