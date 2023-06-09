import {seccionesctrl} from '../controllers/secciones_control';
import {Router} from 'express';
const router : Router  = Router();

router.post('/agregar', seccionesctrl.Agregar);
router.put('/modificar', seccionesctrl.Modificar);

// Export the router
export default router;