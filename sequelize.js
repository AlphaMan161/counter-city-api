const Sequelize = require('sequelize');
const config = require('./config.js');

const sequelize = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.pass,
    {
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        },
        host: config.db.host,
        logging: false,
        timezone: '+03:00',
    },
);

module.exports = sequelize;