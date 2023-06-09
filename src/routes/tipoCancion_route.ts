import {tipoCancionctrl} from '../controllers/tipoCancion_control';
import {Router} from 'express';
const router : Router  = Router();

router.get('/select', tipoCancionctrl.ObtenerTipoCancionSelector);

// Export the router
export default router;