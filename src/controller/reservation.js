const {reservation, consumer, reservationRules, pitch} = require('../db/model/index');
const {SuccessModel, ErrorModel} = require('../model/resModel');
const {reservationFailInfo, reservationConflictInfo, insufficientRemainingTime} = require('../model/errorInfo');
const {lock, unlock} = require('../cache/user');
const {reservationRedisLockTimeout} = require('../conf/constant');
const seq = require('../db/seq');

async function create(ctx, reservationDate, consumerId, courtId, selected) {
  const res = await reservation.findAll({
    where: {
      reservationDate,
      consumerId,
      status: 1,
    },
    raw: true,
  });

  const rules = await getReservationRules(ctx, courtId);

  if (res.length + selected.length > (rules?.data?.limit || Infinity)) {
    return new ErrorModel(reservationFailInfo);
  }

  const keys = selected.map((item) => reservationDate + item.startTime + item.endTime + item.pitchId);
  const lockStatus = await Promise.all(keys.map(((item) => lock(item, reservationRedisLockTimeout))).map((promise) => promise.catch((e) => e)));

  const lockFail = lockStatus.some((item) => item instanceof Error);

  if (lockFail) {
    return new ErrorModel(reservationConflictInfo);
  }

  const reservationExist = await Promise.all(selected.map((item) => reservation.findOne({where: {
    reservationDate: reservationDate,
    startTime: item.startTime,
    endTime: item.endTime,
    pitchId: item.pitchId,
    status: 1,
  }})));

  if (reservationExist.some((item) => item != null)) {
    return new ErrorModel(reservationConflictInfo);
  }

  const _consumer = await consumer.findOne({where: {id: consumerId}, raw: true});

  if (_consumer.remainingTime - selected.length < 0) {
    return new ErrorModel(insufficientRemainingTime);
  }

  const t = await seq.transaction();

  const values = selected.map((item) => {
    return {
      ...item,
      type: 0,
      reservationDate,
      consumerId,
    };
  });


  try {
    await reservation.bulkCreate(values, {transaction: t});
    await consumer.increment({remainingTime: -(selected.length)}, {where: {id: consumerId}, transaction: t});
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  } finally {
    await Promise.all(keys.map((item) => unlock(item)));
  }

  return new SuccessModel();
}

async function getData(ctx, search) {
  const consumerWhereOpt = {};
  const pitchWhereOpt = {};
  const whereOpt = {...search};
  delete whereOpt?.phone;
  delete whereOpt?.courtId;
  search?.phone ? consumerWhereOpt.phone = search.phone : null;
  search?.courtId ? pitchWhereOpt.courtId = search.courtId : null;
  const res = await reservation.findAll({
    where: whereOpt,
    order: [['reservationDate', 'desc']],
    include: [{
      model: consumer,
      where: consumerWhereOpt,
    }, {
      model: pitch,
      where: pitchWhereOpt,
    }],
  });

  return new SuccessModel(res);
}

async function update(ctx, id, values) {
  const res = await reservation.findOne({
    where: {
      id,
    },
    raw: true,
  });

  await reservation.update(values, {
    where: {
      id,
    },
  });

  await consumer.increment({remainingTime: 1}, {where: {id: res.consumerId}});
  return new SuccessModel();
}

async function getReservationRules(ctx, courtId) {
  const res = await reservationRules.findOne({
    where: {
      courtId,
    },
    raw: true,
  });

  return new SuccessModel(res);
}

async function setReservationRules(ctx, values, courtId) {
  const isExist = await getReservationRules(ctx, courtId);
  if (isExist.data) {
    await reservationRules.update(values, {
      where: {
        courtId,
      },
    });
  } else {
    await reservationRules.create({
      ...values,
      courtId,
    });
  }

  return new SuccessModel();
}

module.exports = {
  create,
  getData,
  update,
  getReservationRules,
  setReservationRules,
};

