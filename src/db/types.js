const Sequelize = require('sequelize');

module.exports = {
  STRING: Sequelize.STRING,
  // eslint-disable-next-line new-cap
  DECIMAL: Sequelize.DECIMAL(10, 2),
  TEXT: Sequelize.TEXT,
  INTEGER: Sequelize.INTEGER,
  BOOLEAN: Sequelize.BOOLEAN,
  JSON: Sequelize.JSON,
  DATE: Sequelize.DATE,
  TIME: Sequelize.TIME,
  DATEONLY: Sequelize.DATEONLY,
};
