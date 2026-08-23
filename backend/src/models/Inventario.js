const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventario = sequelize.define('Inventario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lote_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad_actual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    actualizado_en: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'inventario',
    timestamps: false
});

module.exports = Inventario;