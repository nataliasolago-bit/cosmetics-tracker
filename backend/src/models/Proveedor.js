const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proveedor = sequelize.define('Proveedor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    contacto: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: true
    }
}, {
    tableName: 'proveedores',
    timestamps: false
});

module.exports = Proveedor;
