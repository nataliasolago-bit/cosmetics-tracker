const express = require('express');
const router = express.Router();
const {
    listarProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productoController');
const { verificarToken, permitirRoles } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, listarProductos);
router.get('/:id', verificarToken, obtenerProducto);
router.post('/', verificarToken, crearProducto);
router.put('/:id', verificarToken, actualizarProducto);
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarProducto);

module.exports = router;