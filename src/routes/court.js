const router = require('koa-router')();
const genValidator = require('../middleware/validator');
const {validateCommon} = require('../validator/_validate');
const {isExist, update, getCourtCalendar, getPermissionList, updatePermissionList, getPitchCalendar} = require('../controller/court');

router.prefix('/api/court');


router.get('/isExist', async (ctx, next) => {
  ctx.body = await isExist(ctx);
} );

router.post('/update', async (ctx, next) => {
  const {value, id, menuList} = ctx.request.body;
  ctx.body = await update(ctx, value, id, menuList);
} );

router.post('/getCourtCalendar', async (ctx, next) => {
  const {courtId, pitchType, curDate} = ctx.request.body;
  ctx.body = await getCourtCalendar(ctx, courtId, pitchType, curDate);
} );

router.post('/getPitchCalendar', async (ctx, next) => {
  const {curDate, pitchId} = ctx.request.body;
  ctx.body = await getPitchCalendar(ctx, curDate, pitchId);
} );

router.post('/getPermissionList', async (ctx, next) => {
  const {courtId} = ctx.request.body;
  ctx.body = await getPermissionList(ctx, courtId);
} );

router.post('/updatePermissionList', async (ctx, next) => {
  const {values, courtId} = ctx.request.body;
  ctx.body = await updatePermissionList(ctx, values, courtId);
} );

module.exports = router;
