const seq = require('../seq');
const {STRING, INTEGER} = require('../types');

const userManager = seq.define('userManager', {
  // 在这里定义模型属性
  phoneNumber: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  activated: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  // 这是其他模型参数
  tableName: 't_user_manager',
});


module.exports = userManager;
