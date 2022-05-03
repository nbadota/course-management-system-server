const router = require('koa-router')();
const genValidator = require('../middleware/validator');
const {validateCommon} = require('../validator/_validate');
const {create, getData, delData, update} = require('../controller/card');

router.prefix('/api/card');


router.post('/create', async (ctx, next) => {
  const {values, courtId} = ctx.request.body;
  ctx.body = await create(ctx, values, courtId);
});


router.post('/getData', async (ctx, next) => {
  const {search = '', courtId} = ctx.request.body;
  ctx.body = await getData(ctx, courtId, search);
});


router.post('/delData', async (ctx, next) => {
  const {cardId} = ctx.request.body;
  ctx.body = await delData(ctx, cardId);
});


router.post('/update', async (ctx, next) => {
  const {values, cardId} = ctx.request.body;
  ctx.body = await update(ctx, values, cardId);
});

module.exports = router;
