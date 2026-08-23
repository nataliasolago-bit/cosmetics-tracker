const express = require('express');
const router = express.Router();
const {
    listarMarcas,
    obtenerMarca,
    crearMarca,
    actualizarMarca,
    eliminarMarca
} = require('../controllers/marcaController');

router.get('/', listarMarcas);
router.get('/:id', obtenerMarca);
router.post('/', crearMarca);
router.put('/:id', actualizarMarca);
router.delete('/:id', eliminarMarca);

module.exports = router;