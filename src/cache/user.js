const {redisClient, get, set} = require('./_redis');
const PREFIX = 'phoneVeriCode-';
const LOCK_VALUE = 'lock';
const LOCK_SUCCESS = 'OK';

async function getVeriCodeFromCache(phoneNumber) {
  const key = `${PREFIX}${phoneNumber}`;
  return await get(key);
}

async function setVeriCodeToCache(phoneNumber, veriCode, timeout) {
  const key = `${PREFIX}${phoneNumber}`;
  await set(key, {phoneNumber, veriCode}, timeout);
}

async function lock(key, timeout) {
  const res = await redisClient.set(key, LOCK_VALUE, {
    PX: timeout * 1000,
    NX: true,
  });

  if (res === LOCK_SUCCESS) {
    return Promise.resolve(key);
  } else {
    return Promise.reject(new Error(key));
  }
}

async function unlock(key) {
  await redisClient.del(key);
}

module.exports = {
  getVeriCodeFromCache,
  setVeriCodeToCache,
  lock,
  unlock,
};
