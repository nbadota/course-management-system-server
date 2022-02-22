module.exports = {
  registerUserNameNotExistInfo: {
    errno: 10001,
    message: '该用户尚未购买服务',
  },
  // 登录失败
  loginFailInfo: {
    errno: 10002,
    message: '登录失败',
  },
  jsonSchemaFileInfo: {
    errno: 10003,
    message: '数据格式校验错误',
  },
  sendVerifyCodeFrequentlyFailInfo: {
    errno: 10004,
    message: '验证码发送请求过于频繁',
  },
  verifyCodeErrorInfo: {
    errno: 10005,
    message: '验证码错误',
  },
  loginCheckFailInfo: {
    errno: 10006,
    message: '您尚未登录',
  },
  sendVerifyCodeFailInfo: {
    errno: 10007,
    message: '验证码发送失败',
  },
};
