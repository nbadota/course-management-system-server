const seq = require('../seq');
const {STRING, TIME, BOOLEAN} = require('../types');

const pitch = seq.define('pitch', {
  // 在这里定义模型属性
  name: {
    type: STRING,
    allowNull: false,
  },
  pitchType: {
    type: STRING,
    allowNull: false,
  },
  openTime: {
    type: TIME,
    allowNull: false,
  },
  closeTime: {
    type: TIME,
    allowNull: false,
  },
  activated: {
    type: BOOLEAN,
    allowNull: false,
  },
  message: {
    type: STRING,
    allowNull: true,
  },
  isDelete: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  // 这是其他模型参数
  tableName: 't_pitch',
});


module.exports = pitch;
