const sequelize = require('../config/database');
const Rol = require('./Rol');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Marca = require('./Marca');
const Proveedor = require('./Proveedor');
const Producto = require('./Producto');
const Lote = require('./Lote');
const Inventario = require('./Inventario');
const Movimiento = require('./Movimiento');

// Rol - Usuario
Rol.hasMany(Usuario, { foreignKey: 'rol_id' });
Usuario.belongsTo(Rol, { foreignKey: 'rol_id' });

// Categoria - Producto
Categoria.hasMany(Producto, { foreignKey: 'categoria_id' });
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'Categoria' });

// Marca - Producto
Marca.hasMany(Producto, { foreignKey: 'marca_id' });
Producto.belongsTo(Marca, { foreignKey: 'marca_id' });

// Proveedor - Producto
Proveedor.hasMany(Producto, { foreignKey: 'proveedor_id' });
Producto.belongsTo(Proveedor, { foreignKey: 'proveedor_id' });

// Producto - Lote
Producto.hasMany(Lote, { foreignKey: 'producto_id' });
Lote.belongsTo(Producto, { foreignKey: 'producto_id' });

// Producto - Inventario
Producto.hasMany(Inventario, { foreignKey: 'producto_id' });
Inventario.belongsTo(Producto, { foreignKey: 'producto_id' });

// Lote - Inventario (uno a uno)
Lote.hasOne(Inventario, { foreignKey: 'lote_id' });
Inventario.belongsTo(Lote, { foreignKey: 'lote_id' });

// Producto - Movimiento
Producto.hasMany(Movimiento, { foreignKey: 'producto_id' });
Movimiento.belongsTo(Producto, { foreignKey: 'producto_id' });

// Lote - Movimiento
Lote.hasMany(Movimiento, { foreignKey: 'lote_id' });
Movimiento.belongsTo(Lote, { foreignKey: 'lote_id' });

// Usuario - Movimiento
Usuario.hasMany(Movimiento, { foreignKey: 'usuario_id' });
Movimiento.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = {
    sequelize,
    Rol,
    Usuario,
    Categoria,
    Marca,
    Proveedor,
    Producto,
    Lote,
    Inventario,
    Movimiento
};