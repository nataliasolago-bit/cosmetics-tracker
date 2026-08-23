const { Categoria } = require('../models');

async function listarCategorias(req, res) {
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
}

async function obtenerCategoria(req, res) {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json(categoria);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener la categoría' });
    }
}

async function crearCategoria(req, res) {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'El campo nombre es obligatorio' });
        }
        const nuevaCategoria = await Categoria.create({ nombre, descripcion });
        res.status(201).json(nuevaCategoria);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear la categoría' });
    }
}

async function actualizarCategoria(req, res) {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        const { nombre, descripcion } = req.body;
        await categoria.update({ nombre, descripcion });
        res.json(categoria);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
}

async function eliminarCategoria(req, res) {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        await categoria.destroy();
        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar la categoría. Verifica que no tenga productos asociados.' });
    }
}

module.exports = {
    listarCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};