const router = require('koa-router')();
const genValidator = require('../middleware/validator');
const {validateCommon} = require('../validator/_validate');
const {sendVerifyCode, login, logout} = require('../controller/user');

router.prefix('/api/user');

// 发送验证码
router.post('/genVerifyCode', genValidator(validateCommon({
  type: 'object',
  properties: {
    phoneNumber: {
      type: 'string',
      pattern: '^1[3456789]\\d{9}$',
    },
  },
})), async (ctx, next) => {
  const {phoneNumber} = ctx.request.body;
  ctx.body = await sendVerifyCode(ctx, phoneNumber);
} );


// 登录
router.post('/login', genValidator(validateCommon({
  type: 'object',
  properties: {
    phoneNumber: {
      type: 'string',
      pattern: '^1[3456789]\\d{9}$',
    },
    verifyCode: {
      type: 'string',
      pattern: '^\\d{4}$',
    },
  },
})), async (ctx, next) => {
  const {phoneNumber, verifyCode} = ctx.request.body;
  ctx.body = await login(ctx, phoneNumber, verifyCode);
});

// 退出登录
router.post('/logout', async (ctx, next) => {
  ctx.body = await logout(ctx);
});

// 未登录拦截测试

router.post('/loginCheck', async (ctx, next) => {
  ctx.body = {msg: ctx.state.user};
});


module.exports = router;
