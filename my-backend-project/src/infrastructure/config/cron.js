const cron = require('node-cron');
const Song = require('../domains/song/song.model');

/**
 * Initialize all scheduled tasks
 */
const initCronJobs = () => {
    // Reset dailyListen every day at 00:00 (Midnight)
    cron.schedule('0 0 * * *', async () => {
        console.log('[CRON] Resetting dailyListen counts...');
        try {
            await Song.updateMany({}, { $set: { dailyListen: 0 } });
            console.log('[CRON] Daily reset complete.');
        } catch (err) {
            console.error('[CRON] Daily reset failed:', err);
        }
    });

    // Reset weeklyListen every Monday at 00:00 (Midnight)
    cron.schedule('0 0 * * 1', async () => {
        console.log('[CRON] Resetting weeklyListen counts...');
        try {
            await Song.updateMany({}, { $set: { weeklyListen: 0 } });
            console.log('[CRON] Weekly reset complete.');
        } catch (err) {
            console.error('[CRON] Weekly reset failed:', err);
        }
    });

    console.log('[CRON] Scheduled jobs initialized.');
};

module.exports = { initCronJobs };
