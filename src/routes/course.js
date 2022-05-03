const router = require('koa-router')();
const genValidator = require('../middleware/validator');
const {validateCommon} = require('../validator/_validate');
const {create, getData, delData, update, pay, getClassSchedule} = require('../controller/course');

router.prefix('/api/course');


router.post('/create', async (ctx, next) => {
  const {values, courtId} = ctx.request.body;
  ctx.body = await create(ctx, values, courtId);
});


router.post('/getData', async (ctx, next) => {
  const {courtId} = ctx.request.body;
  ctx.body = await getData(ctx, courtId);
});


router.post('/delData', async (ctx, next) => {
  const {courseId} = ctx.request.body;
  ctx.body = await delData(ctx, courseId);
});


router.post('/update', async (ctx, next) => {
  const {values, courseId} = ctx.request.body;
  ctx.body = await update(ctx, values, courseId);
});

router.post('/pay', async (ctx, next) => {
  const {values, courtId} = ctx.request.body;
  ctx.body = await pay(ctx, values, courtId);
});

router.post('/getClassSchedule', async (ctx, next) => {
  const {search, curDate} = ctx.request.body;
  ctx.body = await getClassSchedule(ctx, search, curDate);
});


module.exports = router;
