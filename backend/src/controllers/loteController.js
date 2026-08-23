const { Lote, Producto, Inventario } = require('../models');
const { Op } = require('sequelize');

// Listar todos los lotes
async function listarLotes(req, res) {
    try {
        const lotes = await Lote.findAll({
            include: [Producto, Inventario]
        });
        res.json(lotes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los lotes' });
    }
}

// Obtener un lote por ID
async function obtenerLote(req, res) {
    try {
        const { id } = req.params;
        const lote = await Lote.findByPk(id, {
            include: [Producto, Inventario]
        });
        if (!lote) {
            return res.status(404).json({ error: 'Lote no encontrado' });
        }
        res.json(lote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el lote' });
    }
}

// Crear un lote (y su inventario inicial automáticamente)
async function crearLote(req, res) {
    try {
        const { producto_id, numero_lote, fecha_fabricacion, fecha_vencimiento, cantidad_inicial } = req.body;

        if (!producto_id || !numero_lote || !fecha_fabricacion || !fecha_vencimiento || cantidad_inicial == null) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const producto = await Producto.findByPk(producto_id);
        if (!producto) {
            return res.status(404).json({ error: 'El producto especificado no existe' });
        }

        // Creamos el lote
        const nuevoLote = await Lote.create({
            producto_id,
            numero_lote,
            fecha_fabricacion,
            fecha_vencimiento,
            cantidad_inicial
        });

        // Creamos automáticamente su inventario inicial
        const inventarioInicial = await Inventario.create({
            producto_id,
            lote_id: nuevoLote.id,
            cantidad_actual: cantidad_inicial
        });

        res.status(201).json({ lote: nuevoLote, inventario: inventarioInicial });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el lote' });
    }
}

// Actualizar un lote (solo datos del lote, no el inventario)
async function actualizarLote(req, res) {
    try {
        const { id } = req.params;
        const lote = await Lote.findByPk(id);
        if (!lote) {
            return res.status(404).json({ error: 'Lote no encontrado' });
        }
        const { numero_lote, fecha_fabricacion, fecha_vencimiento } = req.body;
        await lote.update({ numero_lote, fecha_fabricacion, fecha_vencimiento });
        res.json(lote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el lote' });
    }
}

// Eliminar un lote
async function eliminarLote(req, res) {
    try {
        const { id } = req.params;
        const lote = await Lote.findByPk(id);
        if (!lote) {
            return res.status(404).json({ error: 'Lote no encontrado' });
        }
        await lote.destroy();
        res.json({ message: 'Lote eliminado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el lote. Verifica que no tenga inventario o movimientos asociados.' });
    }
}

// Lotes vencidos
async function lotesVencidos(req, res) {
    try {
        const hoy = new Date();
        const lotes = await Lote.findAll({
            where: { fecha_vencimiento: { [Op.lt]: hoy } },
            include: [Producto, Inventario]
        });
        res.json(lotes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los lotes vencidos' });
    }
}

// Lotes próximos a vencer (dentro de los próximos 30 días)
async function lotesProximosAVencer(req, res) {
    try {
        const hoy = new Date();
        const en30Dias = new Date();
        en30Dias.setDate(hoy.getDate() + 30);

        const lotes = await Lote.findAll({
            where: {
                fecha_vencimiento: { [Op.between]: [hoy, en30Dias] }
            },
            include: [Producto, Inventario]
        });
        res.json(lotes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los lotes próximos a vencer' });
    }
}

module.exports = {
    listarLotes,
    obtenerLote,
    crearLote,
    actualizarLote,
    eliminarLote,
    lotesVencidos,
    lotesProximosAVencer
};
