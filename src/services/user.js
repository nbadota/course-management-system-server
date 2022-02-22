const {userManager} = require('../db/model/index');

async function getUserInfo(phoneNumber) {
  // 查询条件
  const whereOpt = {
    phoneNumber,
  };

  // 查询
  const result = await userManager.findOne({
    attributes: ['id', 'phoneNumber', 'gender', 'activated'],
    where: whereOpt,
  });

  return result;
}

async function sendVeriCodeMsg(phoneNumber, code, timeout = '') {
  return Promise.resolve('ok');
}

module.exports = {
  getUserInfo,
  sendVeriCodeMsg,
};
