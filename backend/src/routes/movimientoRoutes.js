const express = require('express');
const router = express.Router();
const {
    listarMovimientos,
    movimientosPorProducto,
    movimientosPorLote,
    crearMovimiento
} = require('../controllers/movimientoController');

router.get('/producto/:productoId', movimientosPorProducto);
router.get('/lote/:loteId', movimientosPorLote);
router.get('/', listarMovimientos);
router.post('/', crearMovimiento);

module.exports = router;