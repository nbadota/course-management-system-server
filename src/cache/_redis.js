const {createClient} = require('redis');
// const {REDIS_CONF} = require('../conf/db');

// 创建客户端
const redisClient = createClient();
redisClient.on('error', (err) => {
  console.error('redis error', err);
});
redisClient.connect();


async function set(key, val, timeout = 60 * 60) {
  if (typeof val === 'object') {
    val = JSON.stringify(val);
  }
  if (val) {
    await redisClient.set(key, val);
  }
  await redisClient.expire(key, timeout);
}

async function get(key) {
  try {
    const val = await redisClient.get(key);
    if (val == null) {
      return val;
    }
    try {
      return JSON.parse(val);
    } catch (e) {
      return val;
    }
  } catch (e) {
    throw e;
  }
}

module.exports = {
  set,
  get,
};
