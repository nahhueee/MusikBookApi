"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tipoCancion_control_1 = require("../controllers/tipoCancion_control");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/select', tipoCancion_control_1.tipoCancionctrl.ObtenerTipoCancionSelector);
// Export the router
exports.default = router;
