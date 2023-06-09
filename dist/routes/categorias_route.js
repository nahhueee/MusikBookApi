"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categorias_control_1 = require("../controllers/categorias_control");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/total', categorias_control_1.categoriasctrl.ObtenerTotalCategorias);
router.post('/', categorias_control_1.categoriasctrl.ObtenerCategorias);
router.get('/select', categorias_control_1.categoriasctrl.ObtenerCategoriasSelector);
router.get('/:categoria', categorias_control_1.categoriasctrl.ObtenerCategoria);
router.get('/coinc/:categoria', categorias_control_1.categoriasctrl.ObtenerCancionesCategoria);
router.post('/agregar', categorias_control_1.categoriasctrl.Agregar);
router.put('/modificar', categorias_control_1.categoriasctrl.Modificar);
router.post('/eliminar', categorias_control_1.categoriasctrl.Eliminar);
// Export the router
exports.default = router;
