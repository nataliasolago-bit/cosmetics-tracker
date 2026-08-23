const { Producto, Categoria, Marca, Proveedor, Lote, Inventario } = require('../models');

// Obtener todos los productos con sus relaciones
async function listarProductos(req, res) {
    try {
        const productos = await Producto.findAll({
            include: [
                { model: Categoria, as: 'Categoria' },
                Marca,
                Proveedor,
                { model: Lote, include: Inventario }
            ]
        });
        res.json(productos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
}

module.exports = {
    listarProductos
};
