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

// Obtener un solo producto por ID
async function obtenerProducto(req, res) {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id, {
            include: [
                { model: Categoria, as: 'Categoria' },
                Marca,
                Proveedor,
                { model: Lote, include: Inventario }
            ]
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}

// Crear un nuevo producto
async function crearProducto(req, res) {
    try {
        const { nombre, descripcion, categoria_id, marca_id, proveedor_id, precio, stock_minimo } = req.body;

        if (!nombre || !categoria_id || !marca_id || !proveedor_id) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, categoria_id, marca_id, proveedor_id' });
        }

        const nuevoProducto = await Producto.create({
            nombre,
            descripcion,
            categoria_id,
            marca_id,
            proveedor_id,
            precio,
            stock_minimo
        });

        res.status(201).json(nuevoProducto);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
}

// Actualizar un producto existente
async function actualizarProducto(req, res) {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const { nombre, descripcion, categoria_id, marca_id, proveedor_id, precio, stock_minimo } = req.body;

        await producto.update({
            nombre,
            descripcion,
            categoria_id,
            marca_id,
            proveedor_id,
            precio,
            stock_minimo
        });

        res.json(producto);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}

// Eliminar un producto
async function eliminarProducto(req, res) {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await producto.destroy();
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (err) {
        console.error(err);
        // Error típico si el producto tiene lotes asociados (FK constraint)
        res.status(500).json({ error: 'Error al eliminar el producto. Verifica que no tenga lotes asociados.' });
    }
}

module.exports = {
    listarProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};