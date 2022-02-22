const {pick} = require('lodash');
const {court} = require('../db/model/index');
const {SuccessModel} = require('../model/resModel');

async function update(ctx, value, id) {
  const info = pick(value, ['wifi', 'training', 'supermarket', 'bath', 'parkingLot']);
  const formatV = {
    name: value?.name,
    location: value?.location,
    openTime: value?.opening?.[0],
    closeTime: value?.opening?.[1],
    info,
  };
  const exist = await isExist(ctx);
  if (exist.data) {
    court.update(formatV, {
      where: {
        owner: ctx.state.user,
        id,
      },
    });
  } else {
    court.create({
      ...formatV,
      owner,
    });
  }

  return new SuccessModel();
}

async function isExist(ctx) {
  // 查询条件
  const whereOpt = {
    owner: ctx.state.user,
  };

  const result = await court.findOne({
    where: whereOpt,
  });

  return new SuccessModel(result);
}


module.exports = {
  isExist,
  update,
};
