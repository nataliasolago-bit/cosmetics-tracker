const express = require('express');
const router = express.Router();
const {
    listarMarcas,
    obtenerMarca,
    crearMarca,
    actualizarMarca,
    eliminarMarca
} = require('../controllers/marcaController');
const { verificarToken, permitirRoles } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, listarMarcas);
router.get('/:id', verificarToken, obtenerMarca);
router.post('/', verificarToken, crearMarca);
router.put('/:id', verificarToken, actualizarMarca);
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarMarca);

module.exports = router;