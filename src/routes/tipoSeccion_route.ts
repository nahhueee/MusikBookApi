import {tipoSeccionctrl} from '../controllers/tipoSeccion_control';
import {Router} from 'express';
const router : Router  = Router();

router.get('/select', tipoSeccionctrl.ObtenerTiposSeccionSelector);

// Export the router
export default router;