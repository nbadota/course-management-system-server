const router = require('koa-router')();
const genValidator = require('../middleware/validator');
const {validateCommon} = require('../validator/_validate');
const {create, getData, getDataSum, delData, update, searchData} = require('../controller/consumer');

router.prefix('/api/consumer');


router.post('/create', async (ctx, next) => {
  const {values, courtId} = ctx.request.body;
  ctx.body = await create(ctx, values, courtId);
});

router.post('/getData', async (ctx, next) => {
  const {courtId, pagination, search} = ctx.request.body;
  ctx.body = await getData(ctx, courtId, pagination, search);
});

router.post('/searchData', async (ctx, next) => {
  const {courtId, search} = ctx.request.body;
  ctx.body = await searchData(ctx, courtId, search);
});

router.post('/getDataSum', async (ctx, next) => {
  const {courtId, search} = ctx.request.body;
  ctx.body = await getDataSum(ctx, courtId, search);
});

router.post('/delData', async (ctx, next) => {
  const {consumerId} = ctx.request.body;
  ctx.body = await delData(ctx, consumerId);
});

router.post('/update', async (ctx, next) => {
  const {values, consumerId} = ctx.request.body;
  ctx.body = await update(ctx, consumerId, values);
});


module.exports = router;
