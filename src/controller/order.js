const {SuccessModel} = require('../model/resModel');
const {consumer, order, course, cardType} = require('../db/model/index');

async function createOrder(ctx, values, transaction) {
  const res = await order.create(values, {
    ...transaction,
  });
  return res;
}

async function getData(ctx, courtId, pagination, search) {
  const {current, pageSize} = pagination;
  // eslint-disable-next-line camelcase
  const {code, phone, id_no, type} = search;
  const whereOpt = {type};
  const subWhereOpt = {};
  courtId ? whereOpt.courtId = courtId : null;
  code ? whereOpt.code = code : null;
  phone ? subWhereOpt.phone = phone : null;
  // eslint-disable-next-line camelcase
  id_no ? subWhereOpt.id_no = id_no : null;
  const opt = {
    order: [['createdAt', 'DESC']],
    where: whereOpt,
    include: {
      model: consumer,
      where: subWhereOpt,
    },
  };
  if (current && pageSize) {
    opt.offset = (current -1) * pageSize;
    opt.limit = pageSize;
  }
  const res = await order.findAll(opt);

  const itemIdArr = res.map((order) => order.item);

  let itemList = [];

  if (type === 1) {
    itemList = await course.findAll({where: {
      id: itemIdArr,
    }});

    res.forEach((item, index) => {
      item.dataValues.course = itemList.find((course) => course.id === item.dataValues.item);
    });
  } else {
    itemList = await cardType.findAll({where: {
      id: itemIdArr,
    }});

    res.forEach((item, index) => {
      item.dataValues.cardType = itemList.find((cardType) => cardType.id === item.dataValues.item);
    });
  }


  return new SuccessModel(res);
}

const getDataSum = async (ctx, courtId, search) => {
  // eslint-disable-next-line camelcase
  const {code, phone, id_no, type} = search;
  const whereOpt = {courtId, type};
  const subWhereOpt = {};
  code ? whereOpt.code = code : null;
  phone ? subWhereOpt.phone = phone : null;
  // eslint-disable-next-line camelcase
  id_no ? subWhereOpt.id_no = id_no : null;
  const res = await order.count({
    where: whereOpt,
    include: {
      model: consumer,
      where: subWhereOpt,
    },
  });

  return new SuccessModel(res);
};


async function cancel() {

}

module.exports = {
  createOrder,
  getData,
  cancel,
  getDataSum,
};

