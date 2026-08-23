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
const { verificarToken, permitirRoles } = require('../middlewares/authMiddleware');

router.get('/vencidos', verificarToken, lotesVencidos);
router.get('/proximos-a-vencer', verificarToken, lotesProximosAVencer);

router.get('/', verificarToken, listarLotes);
router.get('/:id', verificarToken, obtenerLote);
router.post('/', verificarToken, crearLote);
router.put('/:id', verificarToken, actualizarLote);
router.delete('/:id', verificarToken, permitirRoles('admin'), eliminarLote);

module.exports = router;