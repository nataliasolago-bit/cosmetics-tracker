const { Marca } = require('../models');

async function listarMarcas(req, res) {
    try {
        const marcas = await Marca.findAll();
        res.json(marcas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las marcas' });
    }
}

async function obtenerMarca(req, res) {
    try {
        const { id } = req.params;
        const marca = await Marca.findByPk(id);
        if (!marca) {
            return res.status(404).json({ error: 'Marca no encontrada' });
        }
        res.json(marca);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener la marca' });
    }
}

async function crearMarca(req, res) {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'El campo nombre es obligatorio' });
        }
        const nuevaMarca = await Marca.create({ nombre, descripcion });
        res.status(201).json(nuevaMarca);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear la marca' });
    }
}

async function actualizarMarca(req, res) {
    try {
        const { id } = req.params;
        const marca = await Marca.findByPk(id);
        if (!marca) {
            return res.status(404).json({ error: 'Marca no encontrada' });
        }
        const { nombre, descripcion } = req.body;
        await marca.update({ nombre, descripcion });
        res.json(marca);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar la marca' });
    }
}

async function eliminarMarca(req, res) {
    try {
        const { id } = req.params;
        const marca = await Marca.findByPk(id);
        if (!marca) {
            return res.status(404).json({ error: 'Marca no encontrada' });
        }
        await marca.destroy();
        res.json({ message: 'Marca eliminada correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar la marca. Verifica que no tenga productos asociados.' });
    }
}

module.exports = {
    listarMarcas,
    obtenerMarca,
    crearMarca,
    actualizarMarca,
    eliminarMarca
};