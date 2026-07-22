// backend/src/server.js
const app = require('./app');
const { env, validateEnv } = require('./config/env');
const { connectDB } = require('./config/db');
const logger = require('./utils/logger.util');
const { runSlaBreachCheck } = require('./jobs/slaBreachCheck.job');
const { runMisTimerCheck } = require('./jobs/misTimerCheck.job');
const { runFootageOverdueCheck } = require('./jobs/footageOverdueCheck.job');

async function start() {
  validateEnv();
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`Server running on :${env.PORT} [${env.NODE_ENV}]`);
  });

  // Background jobs
  setInterval(() => runSlaBreachCheck().catch((e) => logger.error(e)), 5 * 60 * 1000);
  setInterval(() => runMisTimerCheck().catch((e) => logger.error(e)), env.MIS_WINDOW_MINUTES * 60 * 1000);
  setInterval(() => runFootageOverdueCheck().catch((e) => logger.error(e)), 60 * 60 * 1000);
}

start().catch((err) => {
  logger.error('Failed to start server:', err.message);
  process.exit(1);
});
