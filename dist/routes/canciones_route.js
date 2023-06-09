"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canciones_control_1 = require("../controllers/canciones_control");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/total', canciones_control_1.cancionesctrl.ObtenerTotalCanciones);
router.post('/', canciones_control_1.cancionesctrl.ObtenerCanciones);
router.get('/:cancion', canciones_control_1.cancionesctrl.ObtenerCancion);
router.post('/agregar', canciones_control_1.cancionesctrl.Agregar);
router.put('/modificar', canciones_control_1.cancionesctrl.Modificar);
router.post('/eliminar', canciones_control_1.cancionesctrl.Eliminar);
// Export the router
exports.default = router;
