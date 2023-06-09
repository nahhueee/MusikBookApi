"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tipoSeccion_control_1 = require("../controllers/tipoSeccion_control");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/select', tipoSeccion_control_1.tipoSeccionctrl.ObtenerTiposSeccionSelector);
// Export the router
exports.default = router;
