const redis = require('redis');
const { REDIS_URI } = require('../constants/Constants');
const { missingKey, missingValue } = require('../constants/serviceErrors');

const client = redis.createClient(REDIS_URI);

(async () => {
  await client.connect();
})();

const get = async (key) => {
  if (!key) throw missingKey;
  try {
    const value = await client.get(key);
    return value;
  } catch (err) {
    return err;
  }
};

const set = async (key, value) => {
  if (!key) throw missingKey;
  if (!value) throw missingValue;
  try {
    const response = await client.setEx(key, 864000, value);
    return response;
  } catch (err) {
    return err;
  }
};

const del = async (key) => {
  if (!key) throw missingKey;
  try {
    const response = await client.del(key);
    return response;
  } catch (err) {
    return err;
  }
};

const disconnect = () => {
  return client.disconnect();
};

module.exports = {
  get,
  set,
  del,
  disconnect,
};