const userManager = require('./userManager');
const court = require('./court');

court.belongsTo(userManager, {
  foreignKey: 'owner',
  targetKey: 'phoneNumber',
});

module.exports = {
  userManager,
  court,
};
