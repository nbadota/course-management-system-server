const Koa = require('koa');
const app = new Koa();
const http = require('http');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const userRouter = require('./routes/userManager');
const courtRouter = require('./routes/court');
const pitchRouter = require('./routes/pitch');
const staffRouter = require('./routes/staff');
const roleRouter = require('./routes/role');
const cardRouter = require('./routes/card');
const consumerRouter = require('./routes/consumer');
const orderRouter = require('./routes/order');
const courseRouter = require('./routes/course');
const reservationRouter = require('./routes/reservation');
const {loginCheck} = require('./middleware/loginCheck');

// 错误处理
onerror(app, {
  accepts: () => 'json',
  json: function json(err, ctx) {
    const env = process.env.NODE_ENV || 'development';
    const isDev = env === 'development';
    let message = (isDev || err.expose) && err.message ?
      err.message :
      http.STATUS_CODES[this.status];
    if (this.status === 500) {
      message = '未知错误，请重试或联系管理员';
    }
    ctx.body = {message};
  },
});
// 挂载中间件
app.use(cors());
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/static'));

// 路由
app.use(loginCheck);
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(courtRouter.routes());
app.use(courtRouter.allowedMethods());
app.use(pitchRouter.routes());
app.use(pitchRouter.allowedMethods());
app.use(staffRouter.routes());
app.use(staffRouter.allowedMethods());
app.use(roleRouter.routes());
app.use(roleRouter.allowedMethods());
app.use(cardRouter.routes());
app.use(cardRouter.allowedMethods());
app.use(consumerRouter.routes());
app.use(consumerRouter.allowedMethods());
app.use(orderRouter.routes());
app.use(orderRouter.allowedMethods());
app.use(courseRouter.routes());
app.use(courseRouter.allowedMethods());
app.use(reservationRouter.routes());
app.use(reservationRouter.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});


module.exports = app;
