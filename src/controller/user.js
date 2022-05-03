const {getUserInfo} = require('../services/user');
const {ErrorModel, SuccessModel} = require('../model/resModel');
const {sendVerifyCodeFrequentlyFailInfo, verifyCodeErrorInfo} = require('../model/errorInfo');
const {court, userManager, role, consumer, cardType} = require('../db/model/index');
const {registerUserNameNotExistInfo} = require('../model/errorInfo');
const {isProd, isDev} = require('../utils/env');
const {msgVeriCodeTimeout, loginTokenExpired} = require('../conf/constant');
const {sendVeriCodeMsg} = require('../services/user');
const {getVeriCodeFromCache, setVeriCodeToCache} = require('../cache/user');
const {Guid} = require('js-guid');
const {set, get} = require('../cache/_redis');
const {update} = require('./court');

async function sendVerifyCode(ctx, phoneNumber) {
  const res = await getUserInfo(phoneNumber);
  if ((res?.length && res?.length !== 1) || res?.length === 0) {
    const con = await consumer.findOne({where: {phone: phoneNumber}}, {raw: true});
    if (!con) {
      return new ErrorModel(registerUserNameNotExistInfo);
    }
  }

  const codeFromCache = await getVeriCodeFromCache(phoneNumber);
  if (codeFromCache?.veriCode) {
    if (!isProd) {
      return new SuccessModel({code: codeFromCache.veriCode});
    }

    return new ErrorModel(sendVerifyCodeFrequentlyFailInfo);
  }

  const verifyCode = Math.random().toString().slice(-4);
  let sendSuccess;

  if (isDev) {
    sendSuccess = true;
  } else {
    try {
      const msgVeriCodeTimeoutMin = String(msgVeriCodeTimeout / 60);
      await sendVeriCodeMsg(phoneNumber, verifyCode, msgVeriCodeTimeoutMin);
      sendSuccess = true;
    } catch (e) {
      sendSuccess = false;
      console.log('sendMsg err', e);
    }
  }

  if (!sendSuccess) {
    return new ErrorModel(sendVerifyCodeFrequentlyFailInfo);
  }

  await setVeriCodeToCache(phoneNumber, verifyCode, msgVeriCodeTimeout);

  const resData = isDev ? {code: verifyCode} : {};
  return new SuccessModel(resData);
}

async function login(ctx, phoneNumber, verifyCode, menuList) {
  const cache = await getVeriCodeFromCache(phoneNumber);
  if (verifyCode !== cache?.veriCode) {
    return new ErrorModel(verifyCodeErrorInfo);
  }
  if (phoneNumber !== cache?.phoneNumber) {
    return new ErrorModel(registerUserNameNotExistInfo);
  }

  const existToken = ctx.cookies.get('token');
  const user = await get(existToken);
  const token = String(user) === phoneNumber ? existToken : Guid.newGuid().StringGuid;

  const res = await getUserInfo(phoneNumber);
  if (!res) {
    ctx.state.user = phoneNumber;
    await userManager.create({phoneNumber});
    await update(ctx, {name: '默认场馆', location: '默认地址'}, null, menuList);
  }
  const obj = {};
  if (res?.length) {
    const staff = res[0];
    const courtInfo = await court.findOne({where: {id: staff.courtId}}, {raw: true});
    const roleInfo = await role.findOne({where: {id: staff.roleId}}, {raw: true});
    const manager = await userManager.findOne({where: {phoneNumber: courtInfo.owner}}, {raw: true});

    obj.staff = phoneNumber;
    obj.manager = manager.phoneNumber;
    obj.grade = roleInfo.grade;
  } else {
    obj.manager = phoneNumber;
    obj.grade = 100;
    obj.message = res ? '登录成功' : '检测到您为第一次登录，已为您自动创建帐号与默认场馆';
  }
  // redis设置token过期时间
  await set(token, obj, loginTokenExpired);

  ctx.cookies.set('token', token, {
    httpOnly: true,
    maxAge: loginTokenExpired * 1000,
  });

  ctx.cookies.set('x-cid', 1, {
    httpOnly: false,
    maxAge: loginTokenExpired * 1000,
  });

  return new SuccessModel(obj);
}

async function consumerLogin(ctx, phoneNumber, verifyCode) {
  const cache = await getVeriCodeFromCache(phoneNumber);
  if (verifyCode !== cache?.veriCode) {
    return new ErrorModel(verifyCodeErrorInfo);
  }
  if (phoneNumber !== cache?.phoneNumber) {
    return new ErrorModel(registerUserNameNotExistInfo);
  }

  const token = Guid.newGuid().StringGuid;
  const res = await consumer.findAll({where: {phone: phoneNumber}, include: cardType}, {raw: true});
  const courtIds = res.map((item) => item.courtId);
  const courts = await court.findAll({where: {id: courtIds}}, {raw: true});

  const obj = {
    token,
    user: res,
    courts,
  };

  await set(token, phoneNumber);

  return new SuccessModel(obj);
}

async function logout(ctx) {
  const token = ctx.cookies.get('token');
  await set(token, null, 0);

  ctx.cookies.set('token', token, {
    httpOnly: true,
    maxAge: -1,
  });

  ctx.cookies.set('x-cid', 1, {
    httpOnly: false,
    maxAge: -1,
  });

  return new SuccessModel();
}

module.exports = {
  sendVerifyCode,
  login,
  logout,
  consumerLogin,
};
