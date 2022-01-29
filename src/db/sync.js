const seq = require('./seq');
require('./model/userManager');


seq.authenticate().then(() => {
  console.log('auth ok');
}).catch(() => {
  console.log('auth err');
});

seq.sync({alter: true}).then(() => {
  console.log('sync success');
  process.exit();
}).catch((err) => {
  console.log(err);
});
