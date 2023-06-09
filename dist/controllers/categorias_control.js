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
exports.categoriasctrl = void 0;
var pool = require('../db').pool;
class categorias_control {
    //#region OBTENER
    ObtenerTotalCategorias(req, res) {
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
    ObtenerCategorias(req, res) {
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
    ObtenerCategoria(req, res) {
        try {
            const categoria = req.params.categoria;
            const query = `SELECT * FROM categorias WHERE id = ?`;
            pool.getConnection(function (error, connection) {
                connection.query(query, categoria, function (error, fields) {
                    connection.release();
                    // Handle error after the release.
                    if (error)
                        HandlearError(req, res, "db", error);
                    res.json(fields[0]);
                });
            });
        }
        catch (error) {
            HandlearError(req, res, "interno", error);
        }
    }
    ObtenerCancionesCategoria(req, res) {
        try {
            const categoria = req.params.categoria;
            const query = `SELECT id FROM canciones WHERE idCategoria = ?`;
            pool.getConnection(function (error, connection) {
                connection.query(query, categoria, function (error, fields) {
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
    }
    ObtenerCategoriasSelector(req, res) {
        try {
            const query = `SELECT id, nombre FROM categorias`;
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
    }
    ;
    //#region ABM
    Agregar(req, res) {
        try {
            const categoria = req.body;
            let parametros = [categoria.nombre, categoria.color];
            const query = `INSERT INTO categorias (nombre,color) VALUES (?,?) `;
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
            const categoria = req.body;
            let parametros = [categoria.nombre, categoria.color, categoria.id];
            const query = ` UPDATE categorias SET nombre = ?, color = ?
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
                            if (data.condicion == "actualizar/eliminar") {
                                //#region ACTUALIZAR CANCION
                                //Actualiza las canciones que contienen el id de la categoria a eliminar, y les asigna el numero 0 
                                let sql = `UPDATE canciones
                                       SET idCategoria = 0 
                                       WHERE idCategoria = ? `;
                                connection.query(sql, data.categoria, function (error, fields) {
                                    if (error) { //ERROR EN QUERY (Rollback y Liberar conexion)
                                        connection.rollback(function () {
                                            connection.release();
                                            HandlearError(req, res, "db", error);
                                        });
                                    }
                                });
                                //#endregion
                            }
                            let query = `DELETE FROM categorias
                                     WHERE id = ? `;
                            connection.query(query, data.categoria, function (error, fields) {
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
// Obtiene una query de categorias y el total de registros si se requiere / Usado para paginación
function ObtenerQuery(filtroTabla, estotal) {
    return new Promise((resolve, rejects) => {
        let query = '';
        let paginacion = '';
        if (!estotal)
            paginacion = " LIMIT " + filtroTabla.tamanioPagina + " OFFSET " + ((filtroTabla.pagina - 1) * filtroTabla.tamanioPagina);
        let count = estotal ? "SELECT COUNT (*) AS total FROM ( " : "";
        let endCount = estotal ? " ) as subquery" : "";
        query = count +
            ` SELECT * from categorias 
                  ORDER BY id DESC `
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
exports.categoriasctrl = new categorias_control();
