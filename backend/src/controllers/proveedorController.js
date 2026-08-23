const { Proveedor } = require('../models');

async function listarProveedores(req, res) {
    try {
        const proveedores = await Proveedor.findAll();
        res.json(proveedores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los proveedores' });
    }
}

async function obtenerProveedor(req, res) {
    try {
        const { id } = req.params;
        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.json(proveedor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el proveedor' });
    }
}

async function crearProveedor(req, res) {
    try {
        const { nombre, contacto, telefono, email } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'El campo nombre es obligatorio' });
        }
        const nuevoProveedor = await Proveedor.create({ nombre, contacto, telefono, email });
        res.status(201).json(nuevoProveedor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el proveedor' });
    }
}

async function actualizarProveedor(req, res) {
    try {
        const { id } = req.params;
        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        const { nombre, contacto, telefono, email } = req.body;
        await proveedor.update({ nombre, contacto, telefono, email });
        res.json(proveedor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el proveedor' });
    }
}

async function eliminarProveedor(req, res) {
    try {
        const { id } = req.params;
        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        await proveedor.destroy();
        res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el proveedor. Verifica que no tenga productos asociados.' });
    }
}

module.exports = {
    listarProveedores,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
};