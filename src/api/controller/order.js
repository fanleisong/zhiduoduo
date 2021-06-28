const Base = require('./base.js');
const moment = require('moment');

module.exports = class extends Base {

  /**
   * 获取订单列表
   * fanleisong
   * @return {Promise} []
   */
   async listAction() {
    const openid = this.post('openid'),orderStatus = this.post('orderStatus');
    if(think.isEmpty(orderStatus)){
      const orderList = await this.model('order').where({ openid: openid}).select();
      for(var item of orderList){
        item.wasteTypeOrderRelaList = await this.model('order_express').where({ orderId: item.orderId }).select();
        //console.log("==")
      }
   // console.log(orderList)
      return this.success(orderList);

    }else{  const   orderList = await this.model('order').where({ openid: openid, orderStatus:orderStatus}).select();
  
    for(var item of orderList){
      item.wasteTypeOrderRelaList = await this.model('order_express').where({ orderId: item.orderId }).select();
    }
    return this.success(orderList);
  }

    
   
  }
   /**
   * 提交订单
   * fanleisong
   * @returns {Promise.<void>}
   */
    async addAction() {
      const e = this.post('e'),uu = this.post('uu');
      const orderInfo = {
        orderId: this.model('order').generateOrderNumber(),
        time:think.datetime(new Date(e.time)),
        contacter:e.contacter,
        poi:e.poi,
        poiDetail:e.poiDetail,
        isFree:e.isFree,
        longitude:e.longitude,
        latitude:e.latitude,
        openid:e.openid,
        wasteTypeOrderRelaList:e.wasteTypeOrderRelaList,
        realLatitude:e.realLatitude,
        realLongitude:e.realLongitude,
        realAddress:e.realAddress,
        userid:uu.id,
        orderStatus:'ORDER_SUBMIT',
        subTime:think.datetime(new Date(e.time))
        
      };
     console.log(orderInfo)
      e.wasteTypeOrderRelaList.forEach(element => {
        element.orderId = orderInfo.orderId
         this.model('order_express').add(element);
      });
      
      
  
      // 开启事务，插入订单信息和订单商品
     const orderId = await this.model('order').add(orderInfo);

    return this.success(orderId);
     }

  

  async detailAction() {
    const orderId = this.get('orderId');
    const orderInfo = await this.model('order').where({ user_id: this.getLoginUserId(), id: orderId }).find();

    if (think.isEmpty(orderInfo)) {
      return this.fail('订单不存在');
    }

    orderInfo.province_name = await this.model('region').where({ id: orderInfo.province }).getField('name', true);
    orderInfo.city_name = await this.model('region').where({ id: orderInfo.city }).getField('name', true);
    orderInfo.district_name = await this.model('region').where({ id: orderInfo.district }).getField('name', true);
    orderInfo.full_region = orderInfo.province_name + orderInfo.city_name + orderInfo.district_name;

    const latestExpressInfo = await this.model('order_express').getLatestOrderExpress(orderId);
    orderInfo.express = latestExpressInfo;

    const orderGoods = await this.model('order_goods').where({ order_id: orderId }).select();

    // 订单状态的处理
    orderInfo.order_status_text = await this.model('order').getOrderStatusText(orderId);
    orderInfo.add_time = moment.unix(orderInfo.add_time).format('YYYY-MM-DD HH:mm:ss');
    orderInfo.final_pay_time = moment('001234', 'Hmmss').format('mm:ss');
    // 订单最后支付时间
    if (orderInfo.order_status === 0) {
      // if (moment().subtract(60, 'minutes') < moment(orderInfo.add_time)) {
      orderInfo.final_pay_time = moment('001234', 'Hmmss').format('mm:ss');
      // } else {
      //     //超过时间不支付，更新订单状态为取消
      // }
    }

    // 订单可操作的选择,删除，支付，收货，评论，退换货
    const handleOption = await this.model('order').getOrderHandleOption(orderId);
    return this.success({
      orderInfo: orderInfo,
      orderGoods: orderGoods,
      handleOption: handleOption
    });
  }

 

  /**
   * 查询物流信息
   * @returns {Promise.<void>}
   */
  async expressAction() {
    const orderId = this.get('orderId');
    if (think.isEmpty(orderId)) {
      return this.fail('订单不存在');
    }
    const latestExpressInfo = await this.model('order_express').getLatestOrderExpress(orderId);
    return this.success(latestExpressInfo);
  }

  /**
   * 删除订单列表
   * fanleisong
   * @return {Promise} []
   */
   async deleteAction() {
    const order_sn = this.post('ordersn');
    const orderInfo = await this.model('order').where({ order_sn: order_sn }).find();
 //   console.log(orderInfo.id);
    await this.model('order_goods').where({ order_id: orderInfo.id }).delete();
    const delteresult = await this.model('order').where({ order_sn: order_sn }).delete();
    return this.success(delteresult);
    }

  /**
   * 订单评价
   * fanleisong
   * @return {Promise} []
   */
   async setstarAction() {
    const star = this.post('star'),orderid = this.post('orderid');
    const affectedRows = await this.model('order').where({orderId: orderid}).update({star: star});
    return this.success(affectedRows);
    }
};
