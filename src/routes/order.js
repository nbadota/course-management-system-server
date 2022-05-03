const router = require('koa-router')();
const genValidator = require('../middleware/validator');
const {validateCommon} = require('../validator/_validate');
const {getData, getDataSum} = require('../controller/order');

router.prefix('/api/order');

router.post('/getData', async (ctx, next) => {
  const {courtId, pagination, search} = ctx.request.body;
  ctx.body = await getData(ctx, courtId, pagination, search);
});

router.post('/getDataSum', async (ctx, next) => {
  const {courtId, search} = ctx.request.body;
  ctx.body = await getDataSum(ctx, courtId, search);
});

module.exports = router;

