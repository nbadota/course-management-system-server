const router = require('koa-router')();
const genValidator = require('../middleware/validator');
const {validateCommon} = require('../validator/_validate');
const {create, getData, delData, update} = require('../controller/staff');
const {upload} = require('../utils/upload');

router.prefix('/api/staff');


router.post('/create', upload.single('avatar', 1), async (ctx, next) => {
  const {values, courtId} = ctx.request.body;
  ctx.body = await create(ctx, values, courtId);
});

router.post('/getData', async (ctx, next) => {
  const {courtId, search} = ctx.request.body;
  ctx.body = await getData(ctx, courtId, search);
});

router.post('/delData', async (ctx, next) => {
  const {staffId} = ctx.request.body;
  ctx.body = await delData(ctx, staffId);
});

router.post('/update', upload.single('avatar', 1), async (ctx, next) => {
  const {values, staffId} = ctx.request.body;
  ctx.body = await update(ctx, values, staffId);
});

module.exports = router;
