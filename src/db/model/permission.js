const seq = require('../seq');
const {JSON} = require('../types');

const permission = seq.define('permission', {
  // 在这里定义模型属性
  info: {
    type: JSON,
    allowNull: false,
  },
}, {
  // 这是其他模型参数
  tableName: 't_permission',
  timestamps: false,
});


module.exports = permission;
