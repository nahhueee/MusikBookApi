"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tipos_control_1 = require("../controllers/tipos_control");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/select', tipos_control_1.tiposctrl.ObtenerTiposSelector);
// Export the router
exports.default = router;
