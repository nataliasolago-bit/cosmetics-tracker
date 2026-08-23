const { Movimiento, Producto, Lote, Inventario, Usuario } = require('../models');

// Listar todos los movimientos
async function listarMovimientos(req, res) {
    try {
        const movimientos = await Movimiento.findAll({
            include: [Producto, Lote, Usuario],
            order: [['fecha', 'DESC']]
        });
        res.json(movimientos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los movimientos' });
    }
}

// Historial de movimientos de un producto específico
async function movimientosPorProducto(req, res) {
    try {
        const { productoId } = req.params;
        const movimientos = await Movimiento.findAll({
            where: { producto_id: productoId },
            include: [Lote, Usuario],
            order: [['fecha', 'DESC']]
        });
        res.json(movimientos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el historial del producto' });
    }
}

// Historial de movimientos de un lote específico
async function movimientosPorLote(req, res) {
    try {
        const { loteId } = req.params;
        const movimientos = await Movimiento.findAll({
            where: { lote_id: loteId },
            include: [Producto, Usuario],
            order: [['fecha', 'DESC']]
        });
        res.json(movimientos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el historial del lote' });
    }
}

// Registrar un nuevo movimiento (y actualizar el inventario automáticamente)
async function crearMovimiento(req, res) {
    try {
        const { producto_id, lote_id, tipo, cantidad, motivo, usuario_id } = req.body;

        if (!producto_id || !lote_id || !tipo || !cantidad || !usuario_id) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: producto_id, lote_id, tipo, cantidad, usuario_id' });
        }

        if (!['entrada', 'salida'].includes(tipo)) {
            return res.status(400).json({ error: "El campo 'tipo' debe ser 'entrada' o 'salida'" });
        }

        if (cantidad <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
        }

        // Buscamos el inventario del lote
        const inventario = await Inventario.findOne({ where: { lote_id } });
        if (!inventario) {
            return res.status(404).json({ error: 'No existe inventario para este lote' });
        }

        // Si es salida, validamos que haya suficiente stock
        if (tipo === 'salida' && inventario.cantidad_actual < cantidad) {
            return res.status(400).json({
                error: `Stock insuficiente. Cantidad disponible: ${inventario.cantidad_actual}`
            });
        }

        // Calculamos la nueva cantidad
        const nuevaCantidad = tipo === 'entrada'
            ? inventario.cantidad_actual + cantidad
            : inventario.cantidad_actual - cantidad;

        // Actualizamos el inventario
        await inventario.update({ cantidad_actual: nuevaCantidad });

        // Registramos el movimiento
        const nuevoMovimiento = await Movimiento.create({
            producto_id,
            lote_id,
            tipo,
            cantidad,
            motivo,
            usuario_id
        });

        res.status(201).json({
            movimiento: nuevoMovimiento,
            inventario_actualizado: inventario
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar el movimiento' });
    }
}

module.exports = {
    listarMovimientos,
    movimientosPorProducto,
    movimientosPorLote,
    crearMovimiento
};