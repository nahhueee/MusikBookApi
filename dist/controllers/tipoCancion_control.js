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
exports.tipoCancionctrl = void 0;
var pool = require('../db').pool;
class tipoCancion_control {
    //#region OBTENER
    ObtenerTipoCancionSelector(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM tipo_cancion`;
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
exports.tipoCancionctrl = new tipoCancion_control();
