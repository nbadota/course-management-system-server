const {pick} = require('lodash');
const {court, pitch, permission, role} = require('../db/model/index');
const {SuccessModel} = require('../model/resModel');
const {getClassSchedule} = require('../controller/course');
const {getData} = require('../controller/reservation');

async function update(ctx, value, id, menuList) {
  const info = pick(value, ['wifi', 'training', 'supermarket', 'bath', 'parkingLot']);
  const genPermissionList = function(menuList) {
    return menuList.map((item) => {
      return {
        ...item,
        grade: 0,
        children: item?.children ? genPermissionList(item.children) : undefined,
      };
    });
  };
  const permissionList = genPermissionList(menuList);
  const formatV = {
    name: value?.name,
    location: value?.location,
    openTime: value?.opening?.[0],
    closeTime: value?.opening?.[1],
    info,
  };
  if (id) {
    await court.update(formatV, {
      where: {
        owner: ctx.state.user,
        id,
      },
    });
  } else {
    const res = await court.create({
      ...formatV,
      owner: ctx.state.user,
    }, {raw: true});

    await permission.create({
      info: permissionList,
      courtId: res.id,
    });

    await role.bulkCreate([{name: '经理', grade: 0, courtId: res.id},
      {name: '教练', grade: 0, courtId: res.id},
      {name: '销售', grade: 0, courtId: res.id},
      {name: '维保', grade: 0, courtId: res.id},
    ]);
  }

  return new SuccessModel();
}

async function isExist(ctx) {
  // 查询条件
  const whereOpt = {
    owner: ctx.state.user,
  };

  const result = await court.findAll({
    where: whereOpt,
  });

  return new SuccessModel(result);
}

async function getCourtCalendar(ctx, courtId, pitchType, curDate) {
  const pitches = await pitch.findAll({
    where: {
      courtId,
      pitchType,
      activated: 1,
      isDelete: false,
    },
    raw: true,
  });

  for (let i=0; i < pitches.length; i++) {
    const courses = await getClassSchedule(ctx, {pitchId: pitches[i].id}, curDate);
    const reservations = await getData(ctx, {pitchId: pitches[i].id, reservationDate: curDate, status: true});
    pitches[i].course = courses.data;
    pitches[i].reservation = reservations.data;
  }

  return new SuccessModel(pitches);
}

async function getPitchCalendar(ctx, curDate, pitchId) {
  const pitchInfo = await pitch.findOne({
    where: {
      id: pitchId,
      activated: 1,
      isDelete: false,
    },
    raw: true,
  });

  const courses = await getClassSchedule(ctx, {pitchId: pitchId}, curDate);
  const reservations = await getData(ctx, {pitchId: pitchId, reservationDate: curDate, status: true});
  pitchInfo.course = courses.data;
  pitchInfo.reservation = reservations.data;

  return new SuccessModel(pitchInfo);
}

async function getPermissionList(ctx, courtId) {
  const res = await permission.findAll({
    where: {
      courtId,
    },
  });

  return new SuccessModel(res);
}

async function updatePermissionList(ctx, values, courtId) {
  await permission.update({
    info: values,
  }, {
    where: {
      courtId,
    },
  });

  return new SuccessModel();
}

module.exports = {
  isExist,
  update,
  getCourtCalendar,
  getPermissionList,
  updatePermissionList,
  getPitchCalendar,
};
