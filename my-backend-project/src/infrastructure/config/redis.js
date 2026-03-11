const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
            if (retries > 5) return new Error('Retry limit reached');
            return Math.min(retries * 100, 3000);
        }
    },
    disableOfflineQueue: true // QUAN TRỌNG: Không xếp hàng nếu Redis sập, lỗi luôn để dùng DB
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('🚀 Redis Client Connected'));

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

module.exports = {
    redisClient,
    connectRedis
};
