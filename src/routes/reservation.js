const router = require('koa-router')();
const genValidator = require('../middleware/validator');
const {validateCommon} = require('../validator/_validate');
const {create, update, getReservationRules, setReservationRules, getData} = require('../controller/reservation');

router.prefix('/api/reservation');


router.post('/create', async (ctx, next) => {
  const {reservationDate, consumerId, courtId, selected} = ctx.request.body;
  ctx.body = await create(ctx, reservationDate, consumerId, courtId, selected);
});

router.post('/update', async (ctx, next) => {
  const {values, id} = ctx.request.body;
  ctx.body = await update(ctx, id, values);
});

router.post('/getData', async (ctx, next) => {
  const {search} = ctx.request.body;
  ctx.body = await getData(ctx, search);
});

router.post('/getReservationRules', async (ctx, next) => {
  const {courtId} = ctx.request.body;
  ctx.body = await getReservationRules(ctx, courtId);
});

router.post('/setReservationRules', async (ctx, next) => {
  const {values, courtId} = ctx.request.body;
  ctx.body = await setReservationRules(ctx, values, courtId);
});

module.exports = router;
