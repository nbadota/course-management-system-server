const router = require('koa-router')();
const {getData, update} = require('../controller/role');

router.prefix('/api/role');


router.post('/getData', async (ctx, next) => {
  const {courtId} = ctx.request.body;
  ctx.body = await getData(ctx, courtId);
});

router.post('/update', async (ctx, next) => {
  const {values, id} = ctx.request.body;
  ctx.body = await update(ctx, values, id);
});


module.exports = router;
