const seq = require('../seq');
const {STRING, JSON, TIME} = require('../types');

const court = seq.define('court', {
  // 在这里定义模型属性
  name: {
    type: STRING,
    allowNull: true,
  },
  location: {
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
  info: {
    type: JSON,
    allowNull: true,
  },
}, {
  // 这是其他模型参数
  tableName: 'court',
});


module.exports = court;
