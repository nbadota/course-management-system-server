const seq = require('../seq');
const {STRING, INTEGER, BOOLEAN, DECIMAL} = require('../types');

const cardType = seq.define('cardType', {
  // 在这里定义模型属性
  name: {
    type: STRING,
    allowNull: false,
  },
  type: {
    type: STRING,
    allowNull: false,
  },
  validTime: {
    type: INTEGER,
    allowNull: false,
  },
  disCount: {
    type: DECIMAL,
    allowNull: false,
    default: 0,
  },
  price: {
    type: DECIMAL,
    allowNull: false,
  },
  sum: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  instruction: {
    type: STRING,
    allowNull: true,
  },
  message: {
    type: STRING,
    allowNull: true,
  },
  activated: {
    type: BOOLEAN,
    allowNull: false,
  },
  isDelete: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  // 这是其他模型参数
  tableName: 't_card_type',
});


module.exports = cardType;
