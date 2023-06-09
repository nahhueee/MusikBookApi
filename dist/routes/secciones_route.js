"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secciones_control_1 = require("../controllers/secciones_control");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/agregar', secciones_control_1.seccionesctrl.Agregar);
router.put('/modificar', secciones_control_1.seccionesctrl.Modificar);
// Export the router
exports.default = router;
