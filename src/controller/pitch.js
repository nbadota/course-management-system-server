const {SuccessModel} = require('../model/resModel');

async function create() {
  return new SuccessModel();
}

export {
  create,
};
