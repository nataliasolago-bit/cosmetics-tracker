const { Inventario, Producto, Lote } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Listar todo el inventario
async function listarInventario(req, res) {
    try {
        const inventario = await Inventario.findAll({
            include: [Producto, Lote]
        });
        res.json(inventario);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el inventario' });
    }
}

// Obtener inventario de un producto específico (todos sus lotes)
async function inventarioPorProducto(req, res) {
    try {
        const { productoId } = req.params;
        const inventario = await Inventario.findAll({
            where: { producto_id: productoId },
            include: [Lote]
        });
        res.json(inventario);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el inventario del producto' });
    }
}

// Inventario con stock bajo (cantidad_actual <= stock_minimo del producto)
async function stockBajo(req, res) {
    try {
        const inventario = await Inventario.findAll({
            include: [
                { model: Producto, required: true },
                Lote
            ],
            where: sequelize.where(
                sequelize.col('Inventario.cantidad_actual'),
                Op.lte,
                sequelize.col('Producto.stock_minimo')
            )
        });
        res.json(inventario);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el inventario con stock bajo' });
    }
}

module.exports = {
    listarInventario,
    inventarioPorProducto,
    stockBajo
};