const PayStatus = {
  SUCCESS: 0,
  FAIL: 1,
  WAIT_USER_PAY: 2,
  CANCEL: 3,
  ABNORMAL: 4,
};

const PaymentType = {
  CASH: 0,
  ALIPAY: 1,
};


module.exports = {
  reservationRedisLockTimeout: 3,
  msgVeriCodeTimeout: 120,
  loginTokenExpired: 216000,
  aliPaySuccessStatus: 'TRADE_SUCCESS',
  aliPaySuccessCode: '10000',
  aliPayInProcessCode: '10003',
  PayStatus,
  PaymentType,
};

