import {Request, Response, json} from 'express';
import { Seccion } from '../models/seccion';
var pool = require('../db').pool;

class secciones_control{
//#region OBTENER
ObtenerSeccionesCancion(idCancion:number):Promise<Seccion[]>{
    return new Promise((resolve, rejects)=>{
        try {
           
            const resultado: Array<Seccion> = new Array<Seccion>();

            const query = `SELECT s.letra, ts.nombre tipoSeccion FROM secciones s
                           INNER JOIN tipo_seccion ts ON ts.id = s.idTipoSeccion
                           WHERE idCancion = ?`; 
            
            pool.getConnection(function(error, connection) {
                
                connection.query(query, idCancion, function (error, fields) {
                    connection.release();
                    // Recorremos los campos obtenidos y los insertamos 
                    // dentro de un array de secciones para retornarla luego
                    for (let i = 0; i < fields.length; i++) {
                        console.log(fields[i])
                        resultado.push(new Seccion(fields[i]));
                    }
                    resolve(resultado)
                });
            });
        } catch (error:any) {
            rejects(error)
        }
    });
}
//#endregion

//#region ABM
    Agregar(req:Request, res:Response){
        try {
            const seccion = req.body;
            let parametros:any = [seccion.idCancion, seccion.idTipoSeccion, seccion.letra];
            const query = `INSERT INTO secciones (idCancion,idTipoSeccion,letra) VALUES (?,?,?) `

            pool.getConnection(function(error, connection) {
                
                connection.query(query, parametros, function (error, fields) {
                    connection.release();
            
                    // Handle error after the release.
                    if (error) 
                        HandlearError(req,res,"db",error);
                    
                    res.json('OK');
                });
            });
        } catch (error:any) {
            HandlearError(req,res,"interno",error);
        }
    }

    Modificar(req:Request, res:Response){
        try {
            const seccion = req.body;
            let parametros:any = [seccion.idCancion, seccion.idTipoSeccion, seccion.letra, seccion.id];
            const query = ` UPDATE secciones SET idCancion = ?, idTipoSeccion = ?, letra = ?
                            WHERE id = ? `

            pool.getConnection(function(error, connection) {
                
                connection.query(query, parametros, function (error, fields) {
                    connection.release();
            
                    // Handle error after the release.
                    if (error) 
                        HandlearError(req,res,"db",error);
                    
                    res.json('OK');
                });
            });
        } catch (error:any) {
            HandlearError(req,res,"interno",error);
        }
    }
//#endregion
}

//#region FUNCIONES PRIVADAS
//Devuelve un 500 con el error ocasionado indicando si el error proviene de MySQL o es un error de la app
function HandlearError(req:Request, res:Response, mensaje:string, error:string){
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');

    if(mensaje=="db"){
        res.end("Ocurrió un error con la base de datos: " + error);
        throw "Ocurrió un error con la base de datos: " + error;
    }
    if(mensaje=="interno"){
        res.end("Ocurrió un error interno: " + error);
        throw "Ocurrió un error interno: " + error;
    }
}
//#endregion

export const seccionesctrl = new secciones_control();