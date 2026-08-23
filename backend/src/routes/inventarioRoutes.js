const express = require('express');
const router = express.Router();
const {
    listarInventario,
    inventarioPorProducto,
    stockBajo
} = require('../controllers/inventarioController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/stock-bajo', verificarToken, stockBajo);
router.get('/producto/:productoId', verificarToken, inventarioPorProducto);
router.get('/', verificarToken, listarInventario);

module.exports = router;