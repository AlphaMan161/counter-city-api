const sequelize = require('./../sequelize');
const { logger } = require('./../utils/logger');

const UserFactory = require('./models/User');

const User = UserFactory(sequelize);

const alterTables = true;

// Обновление моделей
Promise.all([
    User.sync({ alter: alterTables }),
    
    sequelize.sync()
])
.then(() => console.log('Все модели БД синхронизированы!'))
.catch(error => logger.error('Ошибка при обновлении моделей БД:', error));

module.exports = {
    sequelize,
    User,
};
