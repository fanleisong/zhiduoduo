const Base = require('./base.js');
const moment = require('moment');

module.exports = class extends Base {
  /**
   * 提交订单
   * fanleisong
   * @returns {Promise.<void>}
   */
   async addAction() {
    const openid = this.post('openid'),name = this.post('name'),phone = this.post('phone'),text = this.post('text');

    const advice = { 
      openid:openid,
      name:name,
      phone:phone,
      text:text
    };
   
        
    console.log(advice)
   const orderId = await this.model('advice').add(advice);

  return this.success(orderId);
   }

  /**
   * 获取订单列表
   * fanleisong
   * @return {Promise} []
   */
   async getAction() {
    const openid = this.get('openid');
   if (think.isEmpty(openid)) {
    return this.fail('订单不存在');
  }
   const orderInfo = await this.model('advice').where({ openid: openid }).select();
  console.log(orderInfo)
    this.success(orderInfo)
  }
   

  

};
