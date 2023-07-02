import {categoriasctrl} from '../controllers/categorias_control';
import {Router} from 'express';
const router : Router  = Router();

router.post('/total', categoriasctrl.ObtenerTotalCategorias);
router.post('/', categoriasctrl.ObtenerCategorias);

router.get('/select', categoriasctrl.ObtenerCategoriasSelector);
router.get('/:categoria', categoriasctrl.ObtenerCategoria);
router.get('/coinc/:categoria', categoriasctrl.ObtenerCancionesCategoria);

router.post('/agregar', categoriasctrl.Agregar);
router.put('/modificar', categoriasctrl.Modificar);
router.post('/eliminar', categoriasctrl.Eliminar);

// Export the router
export default router;