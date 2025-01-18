const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('cs_users', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: DataTypes.TEXT,
            defaultValue: '',
            allowNull: true,
        },
        ccid: {
            type: DataTypes.TEXT,
          //  defaultValue: '',
            allowNull: false,
        },
        vcur: {
            type: DataTypes.INTEGER,
            defaultValue: 10,
            allowNull: false
        },
        lvl: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        inventory: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        weap: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        view: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        babil: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
    }, {
        timestamps: true
    });
};
