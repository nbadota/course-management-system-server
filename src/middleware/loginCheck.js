const {ErrorModel} = require('../model/ResModel');
const {loginCheckFailInfo} = require('../model/ErrorInfo');
const {whiteList} = require('../conf/whiteList');
const {get} = require('../cache/_redis');

async function loginCheck(ctx, next) {
  if (whiteList.includes(ctx.path)) {
    await next();
    return;
  }
  const token = ctx.cookies.get('token');
  const user = await get(token);
  if (user) {
    ctx.state.user = user;
    await next();
  } else {
    ctx.body = new ErrorModel(loginCheckFailInfo);
  }
}


module.exports = {
  loginCheck,
};
