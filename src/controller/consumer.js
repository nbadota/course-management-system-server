const seq = require('../db/seq');
const {consumer, cardType} = require('../db/model/index');
const {alipaySdk, limitedQuery} = require('../utils/pay');
const {SuccessModel, ErrorModel} = require('../model/resModel');
const {payFailInfo} = require('../model/errorInfo');
const {aliPaySuccessCode, aliPayInProcessCode, aliPaySuccessStatus, PayStatus, PaymentType} = require('../conf/constant');
const {createOrder} = require('./order');
const moment = require('../conf/monent');

async function create(ctx, values, courtId) {
  // eslint-disable-next-line camelcase
  const {card, id_no, message, name, payCode, paymentType, phone, wechat} = values;
  const t = await seq.transaction();
  let paySuccess = false;
  const outTradeNo = moment().format('YYYYMMDDHHmmss') + Math.random().toString().slice(-6);

  if (Number(paymentType) === PaymentType.CASH) {
    paySuccess = true;
  } else {
    const payRes = await alipaySdk.exec('alipay.trade.pay', {
      bizContent: {
        outTradeNo: outTradeNo,
        totalAmount: card.price,
        subject: '售卡订单',
        scene: 'bar_code',
        auth_code: payCode,
      },
    });

    if (payRes.code === aliPaySuccessCode) {
      paySuccess = true;
    } else if (payRes.code === aliPayInProcessCode) {
      const query = async () => {
        return await alipaySdk.exec('alipay.trade.query', {
          bizContent: {
            outTradeNo: outTradeNo,
          },
        });
      };
      const queryRes = await limitedQuery(query);
      if (queryRes.tradeStatus === aliPaySuccessStatus) {
        paySuccess = true;
      } else {
        const cancelRes = await alipaySdk.exec('alipay.trade.cancel', {
          bizContent: {
            outTradeNo: outTradeNo,
          },
        });
        if (cancelRes.code === aliPaySuccessCode) {
          return new ErrorModel({...payFailInfo, extra: '订单已取消'});
        } else {
          await createOrder(ctx, {
            code: outTradeNo,
            paymentType,
            status: PayStatus.ABNORMAL,
            amount: card.price,
            item: card.id,
            consumerId: 0,
            courtId,
            type: 0,
          });
        }
        return new ErrorModel({...payFailInfo, extra: '状态异常,需手动取消'});
      }
    } else {
      return new ErrorModel({...payFailInfo, extra: payRes?.subMsg});
    }
  }

  if (paySuccess) {
    try {
      const res = await createConsumer({
        courtId,
        name,
        phone,
        wechat,
        // eslint-disable-next-line camelcase
        id_no,
        card: card.id,
        remainingTime: card.validTime,
        message,
      }, {transaction: t});

      await createOrder(ctx, {
        code: outTradeNo,
        paymentType,
        status: PayStatus.SUCCESS,
        amount: card.price,
        item: card.id,
        consumerId: res.id,
        courtId,
        type: 0,
      }, {transaction: t});

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  return new SuccessModel();
}


const createConsumer = async (values, transaction = {}) => {
  const res = await consumer.create(values, {
    ...transaction,
  });
  return res;
};

const getData = async (ctx, courtId, pagination, search) => {
  const {current, pageSize} = pagination;
  const res = await consumer.findAll({
    offset: (current -1) * pageSize,
    limit: pageSize,
    where: {
      courtId,
      ...search,
      isDelete: false,
    },
  });

  return new SuccessModel(res);
};

const searchData = async (ctx, courtId, search) => {
  const res = await consumer.findOne({
    where: {
      courtId,
      ...search,
      isDelete: false,
    },
    include: cardType,
  });

  return new SuccessModel(res);
};


const getDataSum = async (ctx, courtId, search) => {
  const res = await consumer.count({
    where: {
      courtId,
      ...search,
      isDelete: false,
    },
  });

  return new SuccessModel(res);
};


const delData = async (ctx, consumerId) => {
  await consumer.update({isDelete: true}, {where: {
    id: consumerId,
  }});

  return new SuccessModel();
};


const update = async (ctx, consumerId, values) => {
  await consumer.update(values, {where: {
    id: consumerId,
  }});

  return new SuccessModel();
};

module.exports = {
  create,
  getData,
  getDataSum,
  delData,
  update,
  searchData,
};

