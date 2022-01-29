const seq = require('../seq');
const {STRING, INTEGER} = require('../types');

const userManager = seq.define('userManager', {
  // 在这里定义模型属性
  phoneNumber: {
    type: STRING,
    allowNull: false,
  },
  gender: {
    type: INTEGER,
    allowNull: false,
  },
  activated: {
    type: INTEGER,
    allowNull: false,
  },
}, {
  // 这是其他模型参数
  tableName: 'user_manager',
});


module.exports = userManager;
