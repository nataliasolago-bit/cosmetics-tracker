const express = require('express');
const router = express.Router();
const {
    listarInventario,
    inventarioPorProducto,
    stockBajo
} = require('../controllers/inventarioController');

router.get('/stock-bajo', stockBajo);
router.get('/producto/:productoId', inventarioPorProducto);
router.get('/', listarInventario);

module.exports = router;