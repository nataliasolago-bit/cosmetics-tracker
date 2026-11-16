const { Sequelize } = require('sequelize');
require('dotenv').config();

const options = {
    host: process.env.DB_SERVER || 'localhost',
    dialect: 'mssql',
    logging: false,
    ...(process.env.DB_PORT ? { port: Number(process.env.DB_PORT) } : {}),
    dialectOptions: {
        options: {
            encrypt: process.env.DB_ENCRYPT === 'true',
            trustServerCertificate: process.env.DB_TRUST_CERT !== 'false',
            ...(!process.env.DB_PORT && process.env.DB_INSTANCE
                ? { instanceName: process.env.DB_INSTANCE }
                : {})
        }
    }
};

const sequelize = new Sequelize(
    process.env.DB_DATABASE || 'cosmetics_tracker',
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    options
);

module.exports = sequelize;
