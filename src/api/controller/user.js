const Base = require('./base.js');
const fs = require('fs');
const _ = require('lodash');

module.exports = class extends Base {
  async qishouAction() {
    const data = this.post('id'),qimages = this.post('qimages'),qname = this.post('qname')
    console.log(qname)
    return this.success({msg:'提交成功，请等待客服联系'});
  }


  async infoAction() {
    const id = this.post('id');
    const userInfo = await this.model('user').where({id: id}).find();
    delete userInfo.password;
    return this.json(userInfo);
  }

   /**
   * 保存用户头像
   * @returns {Promise.<void>}
   */
    async saveimageAction() {
      let that =this;
      const avatar = this.file('photo'), id = this.post('id'), filePath = this.post('filePath');    
      if (think.isEmpty(avatar)) {
        return this.fail('保存失败');
      }
      const avatarPath =think.ROOT_PATH  + `\\www\\static\\user\\avatar\\` +id + `.` + _.last(_.split(filePath, '.'));
      console.log(avatarPath);
      // fs.rename(avatar.path, avatarPath, function(res) { 
      //   console.log(res)
      //   return this.success();
      // });
      console.log(avatar.path,{test:"tt"})
      var readStream=fs.createReadStream(avatar.path);
      var writeStream=fs.createWriteStream(avatarPath);
      readStream.pipe(writeStream);
      // readStream.on('end',function(){
      //   return that.success(avatarPath,{test:"tt"});
      // });
      return that.success({url1:filePath,msg:"上传成功"});
    }

  /**
   * 保存用户头像
   * @returns {Promise.<void>}
   */
  async saveAvatarAction() {
    const avatar = this.file('avatar');
    if (think.isEmpty(avatar)) {
      return this.fail('保存失败');
    }

    const avatarPath = think.RESOURCE_PATH + `/static/user/avatar/${this.getLoginUserId()}.` + _.last(_.split(avatar.path, '.'));

    fs.rename(avatar.path, avatarPath, function(res) {
      return this.success();
    });
  }
};
