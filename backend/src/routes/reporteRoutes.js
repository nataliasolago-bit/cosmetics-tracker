const router=require('express').Router();
const {verificarToken}=require('../middlewares/authMiddleware');
const {resumen,exportar}=require('../controllers/reporteController');
router.use(verificarToken);
router.get('/resumen',resumen);
router.get('/exportar/:tipo',exportar);
module.exports=router;
