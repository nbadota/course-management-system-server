const Ajv = require('ajv');

const ajv = new Ajv();

function validate(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    return validate.errors;
  }
}

function validateCommon(schema) {
  return function(data) {
    return validate(schema, data);
  };
}

module.exports = {
  validate,
  validateCommon,
};
