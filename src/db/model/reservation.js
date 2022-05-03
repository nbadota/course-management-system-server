const seq = require('../seq');
const {INTEGER, DATEONLY, TIME, BOOLEAN} = require('../types');

const reservation = seq.define('reservation', {
  // 在这里定义模型属性
  type: {
    type: INTEGER,
    allowNull: false,
  },
  status: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  reservationDate: {
    type: DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: TIME,
    allowNull: false,
  },
  endTime: {
    type: TIME,
    allowNull: false,
  },
}, {
  // 这是其他模型参数
  tableName: 't_reservation',
});


module.exports = reservation;
