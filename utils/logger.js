const winston = require('winston');
const { isProduction } = require('./environment');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (!isProduction) {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
}

module.exports = {
    logger
};