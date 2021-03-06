/**
 * @description 存储配置
 * @author 双越老师
 */

const {isProd} = require('../utils/env');

let REDIS_CONF = {};

let MYSQL_CONF = {
  host: 'localhost',
  user: 'root',
  password: 'li789789@',
  port: '3306',
  database: 'course_management',
};

if (isProd) {
  REDIS_CONF = {
    // 线上的 redis 配置
    password: 'Li789789@',
  };

  MYSQL_CONF = {
    // 线上的 mysql 配置
    host: 'localhost',
    user: 'dms',
    password: 'Li789789@',
    port: '3306',
    database: 'course_management',
  };
}

module.exports = {
  REDIS_CONF,
  MYSQL_CONF,
};
