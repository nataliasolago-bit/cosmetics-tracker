const express = require('express');
const router = express.Router();
const {
    listarProveedores,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} = require('../controllers/proveedorController');
const { verificarToken, permitirRoles } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, listarProveedores);
router.get('/:id', verificarToken, obtenerProveedor);
router.post('/', verificarToken, crearProveedor);
router.put('/:id', verificarToken, actualizarProveedor);
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarProveedor);

module.exports = router;