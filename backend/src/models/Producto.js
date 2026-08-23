const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    marca_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    proveedor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    stock_minimo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    creado_en: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'productos',
    timestamps: false
});

module.exports = Producto;