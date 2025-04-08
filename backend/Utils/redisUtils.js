const { uniqueRedisClient, checkRedisConnection } = require("../redisClinet");


exports.setDataToRedis = async (key, value = true, expiryTime = null) => {
  try {
    if (expiryTime) {
      // Set with expiry time in seconds
      await uniqueRedisClient.setex(key, expiryTime, JSON.stringify(value));
    } else {
      // Set without expiry
      await uniqueRedisClient.set(key, JSON.stringify(value));
    }
    return true;
  } catch (error) {
    console.error("Error setting data to Redis:", error);
    throw error;
  }
};

exports.getDataFromRedis = async (key) => {
  try {
    const data = await uniqueRedisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting data from Redis:", error);
    throw error;
  }
};

exports.deleteDataFromRedis = async (key) => {
  try {
    await uniqueRedisClient.del(key);
    return true;
  } catch (error) {
    console.error("Error deleting data from Redis:", error);
    throw error;
  }
};


// async function main(){
//     //await checkRedisConnection();
    
//     //await exports.setDataToRedis('xprt',true);
//     console.log(await exports.getDataFromRedis('xprt'));
//     //await checkRedisConnection();
// }


// main();