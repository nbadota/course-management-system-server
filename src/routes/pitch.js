const router = require('koa-router')();
const genValidator = require('../middleware/validator');
const {validateCommon} = require('../validator/_validate');
const {create} = require('../controller/pitch');

router.prefix('/api/pitch');


router.post('/create', async (ctx, next) => {
  const {value, courtId} = ctx.request.body;
  ctx.body = await create(ctx, value, courtId);
});

module.exports = router;
