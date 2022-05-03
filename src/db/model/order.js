const seq = require('../seq');
const {STRING, INTEGER, DECIMAL} = require('../types');

const order = seq.define('order', {
  // 在这里定义模型属性
  code: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: INTEGER,
    allowNull: false,
  },
  paymentType: {
    type: INTEGER,
    allowNull: false,
  },
  status: {
    type: INTEGER,
    allowNull: false,
  },
  amount: {
    type: DECIMAL,
    allowNull: false,
  },
  item: {
    type: INTEGER,
    allowNull: false,
  },
}, {
  // 这是其他模型参数
  tableName: 't_order',
});


module.exports = order;
