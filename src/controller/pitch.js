const {Op} = require('sequelize');
const {SuccessModel} = require('../model/resModel');
const pitch = require('../db/model/pitch');

async function create(ctx, values, courtId) {
  await pitch.create({
    ...values,
    courtId,
  });
  return new SuccessModel();
}

async function getData(ctx, courtId, search = {}) {
  const {name, activated} = search;

  const whereOpt = {
    courtId,
    isDelete: false,
  };

  activated ? whereOpt['activated'] = activated : null;

  name || name === '' ? whereOpt['name'] = {
    [Op.substring]: name,
  } : null;

  const res = await pitch.findAll({
    attributes: ['id', 'name', 'pitchType', 'openTime', 'closeTime', 'message', 'activated', 'isDelete'],
    where: whereOpt,
  });

  return new SuccessModel(res);
}

async function delData(ctx, pitchId) {
  await pitch.update({isDelete: true}, {where: {
    id: pitchId,
  }});

  return new SuccessModel();
}

async function update(ctx, values, pitchId) {
  await pitch.update({...values}, {where: {
    id: pitchId,
  }});

  return new SuccessModel();
}

async function getPitchType(ctx, courtId) {
  const allPitch = await pitch.findAll({
    where: {
      courtId,
      activated: 1,
    },
  });

  const pitchType = allPitch.map((item) => item.pitchType);

  const res = Array.from(new Set(pitchType));

  return new SuccessModel(res);
}


module.exports = {
  create,
  getData,
  delData,
  update,
  getPitchType,
};
