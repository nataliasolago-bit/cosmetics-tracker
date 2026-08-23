const express = require('express');
const router = express.Router();
const {
    listarMovimientos,
    movimientosPorProducto,
    movimientosPorLote,
    crearMovimiento
} = require('../controllers/movimientoController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/producto/:productoId', verificarToken, movimientosPorProducto);
router.get('/lote/:loteId', verificarToken, movimientosPorLote);
router.get('/', verificarToken, listarMovimientos);
router.post('/', verificarToken, crearMovimiento);

module.exports = router;