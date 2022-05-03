const userManager = require('./userManager');
const court = require('./court');
const pitch = require('./pitch');
const staff = require('./staff');
const role = require('./role');
const cardType = require('./card');
const consumer = require('./consumer');
const order = require('./order');
const course = require('./course');
const reservation = require('./reservation');
const reservationRules = require('./reservationRules');
const permission = require('./permission');

court.belongsTo(userManager, {
  foreignKey: 'owner',
  targetKey: 'phoneNumber',
});

pitch.belongsTo(court, {
  foreignKey: 'courtId',
});

staff.belongsTo(court, {
  foreignKey: 'courtId',
});

staff.belongsTo(role, {
  foreignKey: 'roleId',
});

cardType.belongsTo(court, {
  foreignKey: 'courtId',
});

consumer.belongsTo(cardType, {
  foreignKey: 'card',
});

consumer.belongsTo(court, {
  foreignKey: 'courtId',
});

order.belongsTo(consumer, {
  foreignKey: 'consumerId',
});

order.belongsTo(court, {
  foreignKey: 'courtId',
});

course.belongsTo(court, {
  foreignKey: 'courtId',
});

course.belongsTo(pitch, {
  foreignKey: 'pitchId',
});

course.belongsTo(staff, {
  foreignKey: 'coachId',
});

reservation.belongsTo(pitch, {
  foreignKey: 'pitchId',
});

reservation.belongsTo(consumer, {
  foreignKey: 'consumerId',
});

reservationRules.belongsTo(court, {
  foreignKey: 'courtId',
});

permission.belongsTo(court, {
  foreignKey: 'courtId',
});

role.belongsTo(court, {
  foreignKey: 'courtId',
});

module.exports = {
  userManager,
  court,
  pitch,
  staff,
  role,
  cardType,
  consumer,
  course,
  order,
  reservation,
  reservationRules,
  permission,
};
