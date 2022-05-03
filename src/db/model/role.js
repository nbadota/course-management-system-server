const seq = require('../seq');
const {STRING, INTEGER} = require('../types');

const role = seq.define('role', {
  // 在这里定义模型属性
  name: {
    type: STRING,
    allowNull: false,
  },
  message: {
    type: STRING,
    allowNull: true,
  },
  grade: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  // 这是其他模型参数
  tableName: 't_role',
  timestamps: false,
});


module.exports = role;
