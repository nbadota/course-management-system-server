const role = require('../db/model/role');
const {SuccessModel} = require('../model/resModel');

async function getData(ctx, courtId) {
  const res = await role.findAll({
    where: {
      courtId,
    },
  });
  return new SuccessModel(res);
}

async function update(ctx, values, id) {
  await role.update(values, {
    where: {
      id,
    },
  });

  return new SuccessModel();
}

module.exports = {
  getData,
  update,
};

