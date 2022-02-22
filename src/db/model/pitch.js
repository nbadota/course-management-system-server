const seq = require('../seq');
const {STRING, INTEGER, TIME} = require('../types');

const pitch = seq.define('pitch', {
  // 在这里定义模型属性
  name: {
    type: STRING,
    allowNull: false,
  },
  pitchType: {
    type: STRING,
    allowNull: true,
  },
  openTime: {
    type: TIME,
    allowNull: true,
  },
  closeTime: {
    type: TIME,
    allowNull: true,
  },
  activated: {
    type: INTEGER,
    allowNull: false,
    default: 1,
  },
  message: {
    type: STRING,
    allowNull: true,
  },
}, {
  // 这是其他模型参数
  tableName: 'pitch',
});


module.exports = pitch;
