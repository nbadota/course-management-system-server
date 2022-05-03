const seq = require('../seq');
const {STRING, TIME, BOOLEAN, INTEGER, DECIMAL, DATEONLY} = require('../types');

const course = seq.define('course', {
  // 在这里定义模型属性
  name: {
    type: STRING,
    allowNull: false,
  },
  // 课程类型 0：团课 1：私教
  courseType: {
    type: INTEGER,
    allowNull: false,
  },
  price: {
    type: DECIMAL,
    allowNull: false,
  },
  startTime: {
    type: TIME,
    allowNull: false,
  },
  endTime: {
    type: TIME,
    allowNull: false,
  },
  startDate: {
    type: DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DATEONLY,
    allowNull: false,
  },
  currentSize: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  classSize: {
    type: INTEGER,
    allowNull: false,
  },
  activated: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  weekly: {
    type: STRING,
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
  tableName: 't_course',
});


module.exports = course;
