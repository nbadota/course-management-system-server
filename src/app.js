const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

const userRouter = require('./routes/user');
const courtRouter = require('./routes/court');
const {loginCheck} = require('./middleware/loginCheck');

// 错误处理
onerror(app);

// 挂载中间件
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

// 路由
app.use(loginCheck);
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(courtRouter.routes());
app.use(courtRouter.allowedMethods());


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
