const router = require('koa-router')();
const genValidator = require('../middleware/validator');
const {validateCommon} = require('../validator/_validate');
const {isExist, update} = require('../controller/court');

router.prefix('/api/court');


router.get('/isExist', async (ctx, next) => {
  ctx.body = await isExist(ctx);
} );

router.post('/update', async (ctx, next) => {
  const {value, id} = ctx.request.body;
  ctx.body = await update(ctx, value, id);
} );

module.exports = router;
