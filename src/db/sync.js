const seq = require('./seq');
require('./model/index');


seq.authenticate().then(() => {
  console.log('auth ok');
}).catch((err) => {
  console.log('auth err-------', err);
});


seq.sync({alter: true}).then(() => {
  console.log('sync success');
  process.exit();
}).catch((err) => {
  console.log('sync err-------', err);
});

