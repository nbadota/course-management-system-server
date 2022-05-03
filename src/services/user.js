const {userManager, staff} = require('../db/model/index');

async function getUserInfo(phoneNumber) {
  let user = null;

  const manager = await userManager.findOne({
    attributes: ['id', 'phoneNumber', 'activated'],
    where: {
      phoneNumber,
      activated: 1,
    },
  }, {raw: true});

  if (manager) {
    user = manager;
  } else {
    const staf = await staff.findAll({
      attributes: ['name', 'phone', 'courtId', 'roleId'],
      where: {
        phone: phoneNumber,
        isDelete: false,
      },
    }, {raw: true});

    if (staf.length) {
      user = staf;
    }
  }

  return user;
}

async function sendVeriCodeMsg(phoneNumber, code, timeout = '') {
  return Promise.resolve('ok');
}

module.exports = {
  getUserInfo,
  sendVeriCodeMsg,
};
