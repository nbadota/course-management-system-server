const {getUserInfo} = require('../services/user');
const {ErrorModel, SuccessModel} = require('../model/resModel');
const {sendVerifyCodeFrequentlyFailInfo, verifyCodeErrorInfo} = require('../model/errorInfo');
const {registerUserNameNotExistInfo} = require('../model/errorInfo');
const {isProd, isDev} = require('../utils/env');
const {msgVeriCodeTimeout, loginTokenExpired} = require('../conf/constant');
const {sendVeriCodeMsg} = require('../services/user');
const {getVeriCodeFromCache, setVeriCodeToCache} = require('../cache/user');
const {Guid} = require('js-guid');
const {set, get} = require('../cache/_redis');

async function sendVerifyCode(ctx, phoneNumber) {
  const res = await getUserInfo(phoneNumber);
  if (!res || !res?.dataValues?.activated) {
    return new ErrorModel(registerUserNameNotExistInfo);
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

async function login(ctx, phoneNumber, verifyCode) {
  const {phoneNumber: phoneNumberFromCache, veriCode: codeFromCache} = await getVeriCodeFromCache(phoneNumber);
  if (phoneNumber !== phoneNumberFromCache) {
    return new ErrorModel(registerUserNameNotExistInfo);
  }
  if (codeFromCache !== verifyCode) {
    return new ErrorModel(verifyCodeErrorInfo);
  }

  const existToken = ctx.cookies.get('token');
  const user = await get(existToken);
  const token = String(user) === phoneNumber ? existToken : Guid.newGuid();

  // redis设置token过期时间
  await set(token, phoneNumber, loginTokenExpired);

  ctx.cookies.set('token', token, {
    httpOnly: true,
    maxAge: loginTokenExpired * 1000,
  });

  ctx.cookies.set('x-cid', 1, {
    httpOnly: false,
    maxAge: loginTokenExpired * 1000,
  });

  return new SuccessModel({phoneNumber});
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
};
