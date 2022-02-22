const {ErrorModel} = require('../model/resModel');
const {jsonSchemaFileInfo} = require('../model/errorInfo');

function genValidator(validateFn) {
  async function validator(ctx, next) {
    const data = ctx.request.body || ctx.request.query;
    const error = validateFn(data);
    if (error) {
      // 验证失败
      ctx.body = new ErrorModel(jsonSchemaFileInfo);
      return;
    }
    // 验证成功，继续
    await next();
  }

  return validator;
}

module.exports = genValidator;
