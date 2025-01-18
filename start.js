require("dotenv/config");

const { startWebServer } = require('./web')
const isProduction = require("./utils/environment")
const { logger } = require('./utils/logger')

const clearConsole = () => {
    console.clear();
};

async function startApiServer() {
    try {
        clearConsole();
        console.log(`Status: ${isProduction ? "prod" : "dev"}`);
        startWebServer();
      //  startBot();
    } catch (error) {
        logger.error("Ошибка при общем запуске API сервера:", error);
    }
}

startApiServer();