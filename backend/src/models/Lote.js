const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lote = sequelize.define('Lote', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero_lote: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    fecha_fabricacion: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    cantidad_inicial: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'lotes',
    timestamps: false
});

module.exports = Lote;