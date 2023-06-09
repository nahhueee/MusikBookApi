"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seccionesctrl = void 0;
const seccion_1 = require("../models/seccion");
var pool = require('../db').pool;
class secciones_control {
    //#region OBTENER
    ObtenerSeccionesCancion(idCancion) {
        return new Promise((resolve, rejects) => {
            try {
                const resultado = new Array();
                const query = `SELECT s.letra, ts.nombre tipoSeccion FROM secciones s
                           INNER JOIN tipo_seccion ts ON ts.id = s.idTipoSeccion
                           WHERE idCancion = ?`;
                pool.getConnection(function (error, connection) {
                    connection.query(query, idCancion, function (error, fields) {
                        connection.release();
                        // Recorremos los campos obtenidos y los insertamos 
                        // dentro de un array de secciones para retornarla luego
                        for (let i = 0; i < fields.length; i++) {
                            console.log(fields[i]);
                            resultado.push(new seccion_1.Seccion(fields[i]));
                        }
                        resolve(resultado);
                    });
                });
            }
            catch (error) {
                rejects(error);
            }
        });
    }
    //#endregion
    //#region ABM
    Agregar(req, res) {
        try {
            const seccion = req.body;
            let parametros = [seccion.idCancion, seccion.idTipoSeccion, seccion.letra];
            const query = `INSERT INTO secciones (idCancion,idTipoSeccion,letra) VALUES (?,?,?) `;
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
            const seccion = req.body;
            let parametros = [seccion.idCancion, seccion.idTipoSeccion, seccion.letra, seccion.id];
            const query = ` UPDATE secciones SET idCancion = ?, idTipoSeccion = ?, letra = ?
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
}
//#region FUNCIONES PRIVADAS
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
exports.seccionesctrl = new secciones_control();
