const AlipaySdk = require('alipay-sdk').default;
const fs = require('fs');
const path = require('path');
const {aliPaySuccessStatus} = require('../conf/constant');

const alipaySdk = new AlipaySdk({
  appId: '2021000119627295',
  privateKey: fs.readFileSync(path.resolve(__dirname, '..', 'conf', 'privateKey.pem'), 'ascii'),
  alipayPublicKey: fs.readFileSync(path.resolve(__dirname, '..', 'conf', 'publicKey.pem'), 'ascii'),
  gateway: 'https://openapi.alipaydev.com/gateway.do',
});

const limitedQuery = async (func, times = 3) => {
  try {
    const res = await func();
    if (res.tradeStatus !== aliPaySuccessStatus && times > 0) {
      return await limitedQuery(func, times -1);
    } else {
      return res;
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  alipaySdk,
  limitedQuery,
};
