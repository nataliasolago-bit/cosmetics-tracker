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

// Inventario con stock bajo (suma de todos los lotes del producto <= stock_minimo)
async function stockBajo(req, res) {
    try {
        // Sumamos la cantidad_actual de todos los lotes, agrupado por producto
        const totales = await Inventario.findAll({
            attributes: [
                'producto_id',
                [sequelize.fn('SUM', sequelize.col('cantidad_actual')), 'cantidad_total']
            ],
            group: ['producto_id']
        });

        const productos = await Producto.findAll();
        const productosPorId = Object.fromEntries(productos.map((p) => [p.id, p]));

        const bajos = totales
            .map((item) => ({
                producto_id: item.producto_id,
                cantidad_total: Number(item.get('cantidad_total')),
                Producto: productosPorId[item.producto_id],
            }))
            .filter((item) => item.Producto && item.cantidad_total <= item.Producto.stock_minimo);

        res.json(bajos);
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