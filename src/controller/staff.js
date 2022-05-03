const fs = require('fs');
const {Op} = require('sequelize');
const {SuccessModel} = require('../model/resModel');
const {staff, role} = require('../db/model/index');

async function create(ctx, values, courtId) {
  await staff.create({
    ...JSON.parse(values),
    avatar: ctx.file ? JSON.stringify({
      originalName: ctx.file.originalname,
      path: ctx.file.path,
    }) : undefined,
    courtId,
  });
  return new SuccessModel();
}

async function getData(ctx, courtId, search = {}) {
  const {name, roleName} = search;

  const whereOpt = {
    courtId,
    isDelete: false,
  };

  const roleWhereOpt = {};

  roleName ? roleWhereOpt['name'] = roleName : null;

  name ? whereOpt['name'] = {
    [Op.substring]: name,
  } : null;

  const res = await staff.findAll({
    attributes: ['id', 'name', 'avatar', 'phone', 'roleId', 'message', 'isDelete'],
    where: whereOpt,
    include: [{
      model: role,
      where: roleWhereOpt,
      attributes: [],
    }],
  });

  res.forEach((item) => {
    if (item.avatar) {
      item.avatar = JSON.parse(item.avatar);
    }
  });

  return new SuccessModel(res);
}

async function delData(ctx, staffId) {
  const res = await staff.findOne({
    where: {
      id: staffId,
    },
  });

  if (res.avatar) {
    const path = JSON.parse(res.avatar).path;
    fs.unlinkSync(path);
  }

  await staff.update({isDelete: true}, {where: {
    id: staffId,
  }});

  return new SuccessModel();
}

async function update(ctx, values, staffId) {
  if (ctx.file) {
    const res = await staff.findOne({
      where: {
        id: staffId,
      },
    });

    if (res.avatar) {
      const path = JSON.parse(res.avatar).path;
      fs.unlinkSync(path);
    }
  }

  await staff.update({
    ...JSON.parse(values),
    avatar: ctx.file ? JSON.stringify({
      originalName: ctx.file.originalname,
      path: ctx.file.path,
    }) : undefined,
  }, {where: {
    id: staffId,
  }});

  return new SuccessModel();
}

module.exports = {
  create,
  getData,
  delData,
  update,
};
