const {get, set} = require('./_redis');
const PREFIX = 'phoneVeriCode-';

async function getVeriCodeFromCache(phoneNumber) {
  const key = `${PREFIX}${phoneNumber}`;
  return await get(key);
}

async function setVeriCodeToCache(phoneNumber, veriCode, timeout) {
  const key = `${PREFIX}${phoneNumber}`;
  await set(key, {phoneNumber, veriCode}, timeout);
}

module.exports = {
  getVeriCodeFromCache,
  setVeriCodeToCache,
};
