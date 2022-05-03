const seq = require('../seq');
const {STRING, INTEGER, BOOLEAN} = require('../types');

const consumer = seq.define('consumer', {
  // 在这里定义模型属性
  name: {
    type: STRING,
    allowNull: false,
  },
  phone: {
    type: STRING,
    allowNull: false,
  },
  wechat: {
    type: STRING,
    allowNull: true,
  },
  id_no: {
    type: STRING,
    allowNull: false,
  },
  remainingTime: {
    type: INTEGER,
    allowNull: false,
  },
  message: {
    type: STRING,
    allowNull: true,
  },
  activated: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  isDelete: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  // 这是其他模型参数
  tableName: 't_consumer',
});


module.exports = consumer;
