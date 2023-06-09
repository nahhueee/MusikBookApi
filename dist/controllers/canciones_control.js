"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancionesctrl = void 0;
const cancion_1 = require("../models/cancion");
const secciones_control_1 = require("../controllers/secciones_control");
var pool = require('../db').pool;
class canciones_control {
    //#region OBTENER
    ObtenerTotalCanciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Obtengo los datos de paginacion y filtros
                const filtroTabla = req.body;
                //Armo la query
                const query = yield ObtenerQuery(filtroTabla, true);
                pool.getConnection(function (error, connection) {
                    connection.query(query, function (error, fields) {
                        connection.release();
                        if (error)
                            HandlearError(req, res, "db", error);
                        res.json(fields[0].total);
                    });
                });
            }
            catch (error) {
                HandlearError(req, res, "interno", error);
            }
        });
    }
    ;
    ObtenerCanciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Obtengo los datos de paginacion y filtros
                const filtroTabla = req.body;
                //Armo la query
                const query = yield ObtenerQuery(filtroTabla, false);
                pool.getConnection(function (error, connection) {
                    connection.query(query, function (error, fields) {
                        connection.release();
                        // Handle error after the release.
                        if (error)
                            HandlearError(req, res, "db", error);
                        res.json(fields);
                    });
                });
            }
            catch (error) {
                HandlearError(req, res, "interno", error);
            }
        });
    }
    ;
    ObtenerCancion(req, res) {
        try {
            // Recibimos el id de la cancion
            const idCancion = req.params.cancion;
            // Creamos la query
            const query = `SELECT * FROM canciones WHERE id = ?`;
            const cancion = new cancion_1.Cancion();
            pool.getConnection(function (error, connection) {
                connection.query(query, idCancion, function (error, fields) {
                    return __awaiter(this, void 0, void 0, function* () {
                        connection.release();
                        // Handle error after the release.
                        if (error)
                            HandlearError(req, res, "db", error);
                        //#region CANCION DE RESPUESTA    
                        cancion.id = fields[0].id;
                        cancion.nombre = fields[0].nombre;
                        cancion.bpm = fields[0].bpm;
                        cancion.tonica = fields[0].tonica;
                        cancion.idCategoria = fields[0].idCategoria;
                        cancion.idTipoCancion = fields[0].idTipoCancion;
                        //#endregion    
                        // Obtenemos las secciones de la cancion
                        cancion.secciones = yield secciones_control_1.seccionesctrl.ObtenerSeccionesCancion(parseInt(idCancion));
                        res.json(cancion);
                    });
                });
            });
        }
        catch (error) {
            console.log(error);
            HandlearError(req, res, "interno", error);
        }
    }
    //#region ABM
    Agregar(req, res) {
        try {
            const cancion = req.body;
            let parametros = [cancion.nombre, cancion.tonica, cancion.bpm, cancion.idCategoria, cancion.idTipoCancion];
            const query = `INSERT INTO canciones (nombre,tonica,bpm,idCategoria,idTipoCancion) VALUES (?,?,?,?,?) `;
            pool.getConnection(function (error, connection) {
                connection.query(query, parametros, function (error, fields) {
                    connection.release();
                    // Handle error after the release.
                    if (error)
                        HandlearError(req, res, "db", error);
                    res.json('OK');
                });
            });
        }
        catch (error) {
            HandlearError(req, res, "interno", error);
        }
    }
    Modificar(req, res) {
        try {
            const cancion = req.body;
            let parametros = [cancion.nombre, cancion.tonica, cancion.bpm, cancion.idCategoria, cancion.idTipoCancion, cancion.id];
            const query = ` UPDATE canciones SET nombre = ?, tonica = ?, bpm = ?, idcategoria = ?, idTipoCancion = ?
                            WHERE id = ? `;
            pool.getConnection(function (error, connection) {
                connection.query(query, parametros, function (error, fields) {
                    connection.release();
                    // Handle error after the release.
                    if (error)
                        HandlearError(req, res, "db", error);
                    res.json('OK');
                });
            });
        }
        catch (error) {
            HandlearError(req, res, "interno", error);
        }
    }
    // TODO Revisar el eliminar cancion
    Eliminar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                pool.getConnection(function (error, connection) {
                    connection.beginTransaction(function (error) {
                        if (error) { //ERROR AL INICIAR LA TRANSACCION (Rollback y Liberar conexion)
                            connection.rollback(function () {
                                connection.release();
                                HandlearError(req, res, "db", error);
                            });
                        }
                        else {
                            //#region ELIMINAR ACORDES CANCION
                            let sql1 = `DELETE acordes_cancion
                                        WHERE idcancion = ? `;
                            connection.query(sql1, data.cancion, function (error, fields) {
                                if (error) { //ERROR EN QUERY (Rollback y Liberar conexion)
                                    connection.rollback(function () {
                                        connection.release();
                                        HandlearError(req, res, "db", error);
                                    });
                                }
                            });
                            //#endregion
                            let query = `DELETE FROM canciones
                                     WHERE id = ? `;
                            connection.query(query, data.cancion, function (error, fields) {
                                if (error) { //ERROR EN QUERY (Rollback y Liberar conexion)
                                    connection.rollback(function () {
                                        connection.release();
                                        HandlearError(req, res, "db", error);
                                    });
                                }
                                else {
                                    connection.commit(function (err) {
                                        if (err) { //ERROR AL INTENTAR COMMITEAR (Rollback y Liberar conexion)
                                            connection.rollback(function () {
                                                connection.release();
                                                HandlearError(req, res, "db", err);
                                            });
                                        }
                                        else { //TRANSACCION REALIZADA CORRECTAMENTE
                                            connection.release();
                                            res.json('OK');
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            }
            catch (error) {
                HandlearError(req, res, "interno", error);
            }
        });
    }
}
//#region FUNCIONES PRIVADAS
// Obtiene una query de canciones y el total de registros si se requiere / Usado para paginación
function ObtenerQuery(filtroTabla, estotal) {
    return new Promise((resolve, rejects) => {
        let query = '';
        let paginacion = '';
        let filtro = '';
        if (filtroTabla.filtro != "")
            filtro = " WHERE nombre LIKE '%" + filtroTabla.filtro + "%'";
        if (!estotal)
            paginacion = " LIMIT " + filtroTabla.tamanioPagina + " OFFSET " + ((filtroTabla.pagina - 1) * filtroTabla.tamanioPagina);
        let count = estotal ? "SELECT COUNT (*) AS total FROM ( " : "";
        let endCount = estotal ? " ) as subquery" : "";
        query = count +
            ` SELECT * from canciones `
            + filtro //WHERE
            + ` ORDER BY id DESC `
            + paginacion //LIMIT
            + endCount;
        resolve(query);
    });
}
//Devuelve un 500 con el error ocasionado indicando si el error proviene de MySQL o es un error de la app
function HandlearError(req, res, mensaje, error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    if (mensaje == "db") {
        res.end("Ocurrió un error con la base de datos: " + error);
        throw "Ocurrió un error con la base de datos: " + error;
    }
    if (mensaje == "interno") {
        res.end("Ocurrió un error interno: " + error);
        throw "Ocurrió un error interno: " + error;
    }
}
//#endregion
exports.cancionesctrl = new canciones_control();
