const express = require('express');
const router = express.Router();
const {
    listarLotes,
    obtenerLote,
    crearLote,
    actualizarLote,
    eliminarLote,
    lotesVencidos,
    lotesProximosAVencer
} = require('../controllers/loteController');

// Rutas específicas ANTES de la ruta con :id, para que no choquen
router.get('/vencidos', lotesVencidos);
router.get('/proximos-a-vencer', lotesProximosAVencer);

router.get('/', listarLotes);
router.get('/:id', obtenerLote);
router.post('/', crearLote);
router.put('/:id', actualizarLote);
router.delete('/:id', eliminarLote);

module.exports = router;