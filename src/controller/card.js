const {Op} = require('sequelize');
const {SuccessModel} = require('../model/resModel');
const card = require('../db/model/card');

async function create(ctx, values, courtId) {
  await card.create({
    ...values,
    courtId,
  });
  return new SuccessModel();
}

async function getData(ctx, courtId, search) {
  const originRes = await card.findAll({
    attributes: ['id', 'name', 'type', 'validTime', 'disCount', 'price', 'activated', 'isDelete',
      'sum', 'message', 'instruction',
    ],
    where: search ? {
      courtId,
      name: {
        [Op.substring]: search,
      },
    } : {courtId},
  });

  const res = originRes.filter((item) => !item.isDelete);

  return new SuccessModel(res);
}


async function delData(ctx, cardId) {
  await card.update({isDelete: true}, {where: {
    id: cardId,
  }});

  return new SuccessModel();
}

async function update(ctx, values, cardId) {
  await card.update(values, {where: {
    id: cardId,
  }});

  return new SuccessModel();
}

module.exports = {
  create,
  getData,
  delData,
  update,
};

