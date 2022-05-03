const seq = require('../seq');
const {STRING, BOOLEAN} = require('../types');

const staff = seq.define('staff', {
  // 在这里定义模型属性
  name: {
    type: STRING,
    allowNull: false,
  },
  avatar: {
    type: STRING,
    allowNull: true,
  },
  phone: {
    type: STRING,
    allowNull: true,
  },
  message: {
    type: STRING,
    allowNull: true,
  },
  isDelete: {
    type: BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, {
  // 这是其他模型参数
  tableName: 't_staff',
});


module.exports = staff;
