const userManager = require('./userManager');
const court = require('./court');
const pitch = require('./pitch');

court.belongsTo(userManager, {
  foreignKey: 'owner',
  targetKey: 'phoneNumber',
});

pitch.belongsTo(court, {
  foreignKey: 'courtId',
});

module.exports = {
  userManager,
  court,
  pitch,
};
