const router = require('koa-router')();
const genValidator = require('../middleware/validator');
const {validateCommon} = require('../validator/_validate');
const {create, getData, delData, update, getPitchType} = require('../controller/pitch');

router.prefix('/api/pitch');


router.post('/create', async (ctx, next) => {
  const {values, courtId} = ctx.request.body;
  ctx.body = await create(ctx, values, courtId);
});

router.post('/getData', async (ctx, next) => {
  const {courtId, search} = ctx.request.body;
  ctx.body = await getData(ctx, courtId, search);
});

router.post('/delData', async (ctx, next) => {
  const {pitchId} = ctx.request.body;
  ctx.body = await delData(ctx, pitchId);
});


router.post('/update', async (ctx, next) => {
  const {values, pitchId} = ctx.request.body;
  ctx.body = await update(ctx, values, pitchId);
});

router.post('/getPitchType', async (ctx, next) => {
  const {courtId} = ctx.request.body;
  ctx.body = await getPitchType(ctx, courtId);
});

module.exports = router;
