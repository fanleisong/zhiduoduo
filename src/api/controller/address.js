const Base = require('./base.js');

module.exports = class extends Base {

  /**
   * 添加新的地址
   * fanleisong
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
   async addAction() {
    const addressData ={name:'',address:'',longitude:'',latitude:'',openid:''};
    const poi = this.post('poi');
    const poiDetail = this.post('poiDetail');
    const longitude = this.post('longitude');
    const latitude = this.post('latitude');
    const openid = this.post('openid');
    var reg = /.+?(省|市|自治区|自治州|县|区)/g;
    const regtmp = poiDetail.match(reg);
    
    for(let j = 0; regtmp[j]!=null; j++) {
      if(regtmp[j].search('市')!= -1 ){
        addressData.cityName= regtmp[j];
        const  temp = await this.model('city').where({areaname: addressData.cityName}).find();
        if(think.isEmpty(temp)){}else{
          addressData.cityNum = temp.areanum;
        }
      }
    }
    
    addressData.name = poi;  addressData.address = poiDetail;  addressData.longitude = longitude;  addressData.latitude = latitude; addressData.openid =openid;
       await this.model('address').add(addressData);
    const addressInfo = await this.model('address').where({openid: openid}).find();
    return this.success(addressInfo);
  }
   /**
   * 删除指定的地址
   *  fanleisong
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
    async delAction() {
      const addressId = this.post('id');
      const openid = this.post('openid');
      await this.model('address').where({id: addressId, openid: openid}).delete();
      return this.success('删除成功');
    }


  /**
   * 获取用户的收货地址
   * fanleisong
   * @return {Promise} []
   */
  async getAction() {
    const openid = this.post('openid');
    const addressList = await this.model('address').where({openid: openid}).select();
    let itemKey = 0;
    // for (const addressItem of addressList) {
    //   addressList[itemKey].province_name = await this.model('region').getRegionName(addressItem.province_id);
    //   addressList[itemKey].city_name = await this.model('region').getRegionName(addressItem.city_id);
    //   addressList[itemKey].district_name = await this.model('region').getRegionName(addressItem.district_id);
    //   addressList[itemKey].full_region = addressList[itemKey].province_name + addressList[itemKey].city_name + addressList[itemKey].district_name;
    //   itemKey += 1;
    // }

    return this.success(addressList);
  }

  /**
   * 获取收货地址的详情
   * @return {Promise} []
   */
  async detailAction() {
    const addressId = this.get('id');

    const addressInfo = await this.model('address').where({user_id: this.getLoginUserId(), id: addressId}).find();
    if (!think.isEmpty(addressInfo)) {
      addressInfo.province_name = await this.model('region').getRegionName(addressInfo.province_id);
      addressInfo.city_name = await this.model('region').getRegionName(addressInfo.city_id);
      addressInfo.district_name = await this.model('region').getRegionName(addressInfo.district_id);
      addressInfo.full_region = addressInfo.province_name + addressInfo.city_name + addressInfo.district_name;
    }

    return this.success(addressInfo);
  }

  /**
   * 添加或更新收货地址
   * @returns {Promise.<Promise|PreventPromise|void>}
   */
  async saveAction() {
    let addressId = this.post('id');

    const addressData = {
      name: this.post('name'),
      mobile: this.post('mobile'),
      province_id: this.post('province_id'),
      city_id: this.post('city_id'),
      district_id: this.post('district_id'),
      address: this.post('address'),
      user_id: this.getLoginUserId(),
      is_default: this.post('is_default') === true ? 1 : 0
    };

    if (think.isEmpty(addressId)) {
      addressId = await this.model('address').add(addressData);
    } else {
      await this.model('address').where({id: addressId, user_id: this.getLoginUserId()}).update(addressData);
    }

    // 如果设置为默认，则取消其它的默认
    if (this.post('is_default') === true) {
      await this.model('address').where({id: ['<>', addressId], user_id: this.getLoginUserId()}).update({
        is_default: 0
      });
    }
    const addressInfo = await this.model('address').where({id: addressId}).find();

    return this.success(addressInfo);
  }

 
};
