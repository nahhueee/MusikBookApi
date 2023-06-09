import {cancionesctrl} from '../controllers/canciones_control';
import {Router} from 'express';
const router : Router  = Router();


router.post('/total', cancionesctrl.ObtenerTotalCanciones);
router.post('/', cancionesctrl.ObtenerCanciones);
router.get('/:cancion', cancionesctrl.ObtenerCancion);

router.post('/agregar', cancionesctrl.Agregar);
router.put('/modificar', cancionesctrl.Modificar);
router.post('/eliminar', cancionesctrl.Eliminar);

// Export the router
export default router;