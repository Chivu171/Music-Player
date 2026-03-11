const { redisClient } = require('../../infrastructure/config/redis');

/**
 * Cache utility to handle get-or-set pattern
 * @param {string} key - Cache key
 * @param {function} factory - Function to fetch data if not in cache
 * @param {number} ttl - Time to live in seconds (default 1 hour)
 */
const getOrSetCache = async (key, factory, ttl = 3600) => {
    try {
        if (!redisClient.isOpen) {
            return await factory();
        }

        const cachedData = await redisClient.get(key);
        if (cachedData) {
            console.log(`📦 Cache Hit: ${key}`);
            return JSON.parse(cachedData);
        }

        console.log(`🔍 Cache Miss: ${key}. Fetching from DB...`);
        const data = await factory();

        if (data) {
            await redisClient.setEx(key, ttl, JSON.stringify(data));
        }

        return data;
    } catch (error) {
        console.error(`⚠️ Redis error for key ${key}:`, error);
        return await factory();
    }
};

/**
 * Clear cache by key
 * @param {string} key 
 */
const clearCache = async (key) => {
    try {
        if (redisClient.isOpen) {
            await redisClient.del(key);
            console.log(`🧹 Cache Cleared: ${key}`);
        }
    } catch (error) {
        console.error(`⚠️ Error clearing cache for key ${key}:`, error);
    }
};

module.exports = {
    getOrSetCache,
    clearCache
};
