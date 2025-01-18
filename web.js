const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');

const config = require('./config');
const { isProduction } = require('./utils/environment');
const { logger } = require('./utils/logger');

const app = express();
const port = process.env.PORT || config.api.port;

// Middleware
app.use(cors());
app.use(compression());
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use('/', require('./routes/index'));

async function startWebServer() {
    try {
        app.listen(port, () => console.log('Express-API Port: ', port));
    } catch (error) {
        logger.error('Error start Express-API:', error);
    }
}

module.exports = { startWebServer };