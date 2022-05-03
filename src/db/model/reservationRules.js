const seq = require('../seq');
const {INTEGER} = require('../types');

const reservationRules = seq.define('reservationRules', {
  // 在这里定义模型属性
  allowedCancel: {
    type: INTEGER,
    allowNull: false,
  },
  limit: {
    type: INTEGER,
    allowNull: false,
  },
}, {
  // 这是其他模型参数
  tableName: 't_reservation_rules',
});


module.exports = reservationRules;
