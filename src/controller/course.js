const {Op} = require('sequelize');
const {PaymentType, PayStatus} = require('../conf/constant');
const {createOrder} = require('./order');
const {SuccessModel} = require('../model/resModel');
const {course, staff, pitch} = require('../db/model/index');
const seq = require('../db/seq');
const {searchData} = require('./consumer');
const moment = require('../conf/monent');

async function create(ctx, values, courtId) {
  const weeklyArr = new Array(8).fill(0);
  values.weekly.forEach((item) => {
    weeklyArr[item] = 1;
  });
  const formatValues = {
    ...values,
    startTime: values.time[0],
    endTime: values.time[1],
    startDate: values.date[0],
    endDate: values.date[1],
    weekly: weeklyArr.join(''),
  };
  delete formatValues.time;
  delete formatValues.date;
  await course.create({
    ...formatValues,
    courtId,
  });

  return new SuccessModel();
};

async function getData(ctx, courtId) {
  const res = await course.findAll({
    where: {
      courtId,
      isDelete: false,
    },
    include: [{
      model: staff,
    }, {
      model: pitch,
    }],
  });

  return new SuccessModel(res);
}

async function delData(ctx, courseId) {
  await course.update({
    isDelete: true,
  }, {
    where: {
      id: courseId,
    },
  });

  return new SuccessModel();
}

async function update(ctx, values, courseId, transaction = {}) {
  let weeklyArr = null;
  const formatValues = {
    ...values,
    startTime: values?.time?.[0],
    endTime: values?.time?.[1],
    startDate: values?.date?.[0],
    endDate: values?.date?.[1],
  };
  if (values.weekly) {
    weeklyArr = new Array(8).fill(0);
    values.weekly.forEach((item) => {
      weeklyArr[item] = 1;
    });
    formatValues.weekly = weeklyArr.join('');
  }
  delete formatValues.time;
  delete formatValues.date;
  await course.update(formatValues, {
    where: {
      id: courseId,
    },
  });

  return new SuccessModel();
}

async function pay(ctx, values, courtId) {
  // eslint-disable-next-line no-unused-vars
  const {consumerId, paymentType, payCode, courseDetail} = values;
  const t = await seq.transaction();
  let paySuccess = false;
  const outTradeNo = moment().format('YYYYMMDDHHmmss') + Math.random().toString().slice(-6);

  if (Number(paymentType) === PaymentType.CASH) {
    paySuccess = true;
  } else {
    // todo,支付宝支付
  }

  if (paySuccess) {
    try {
      const {data: consumer} = await searchData(ctx, courtId, {id: consumerId});
      await course.increment({currentSize: 1},
          {
            where: {
              id: courseDetail.id,
            },
            transaction: t,
          });

      await createOrder(ctx, {
        code: outTradeNo,
        paymentType,
        status: PayStatus.SUCCESS,
        amount: Number(courseDetail.price) * Number(consumer.cardType.disCount),
        item: courseDetail.id,
        consumerId: consumerId,
        courtId,
        type: 1,
      }, {transaction: t});

      await t.commit();
    } catch (e) {
      await t.rollback();
    }
  }

  return new SuccessModel();
}

async function getClassSchedule(ctx, search, curDate) {
  const {coachId, pitchId} = search;
  const whereOpt = {
    isDelete: false,
    startDate: {
      [Op.lte]: curDate,
    },
    endDate: {
      [Op.gte]: curDate,
    },
  };

  coachId ? whereOpt.coachId = coachId : null;
  pitchId ? whereOpt.pitchId = pitchId : null;

  const allCourse = await course.findAll({
    where: whereOpt,
    include: pitch,
  });

  const weekDay = moment(curDate).weekday();

  const courseInWeekDay = allCourse.filter((item) => {
    return item.weekly[weekDay + 1] === '1';
  });

  return new SuccessModel(courseInWeekDay);
}

module.exports = {
  create,
  getData,
  delData,
  update,
  pay,
  getClassSchedule,
};

