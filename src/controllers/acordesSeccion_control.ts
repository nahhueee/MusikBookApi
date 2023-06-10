import {Request, Response, json} from 'express';
import { Acorde_Seccion } from '../models/acorde_seccion';
var pool = require('../db').pool;

class acordeSeccion_control{
//#region OBTENER
ObtenerAcordesSeccion(idSeccion:number):Promise<Acorde_Seccion[]>{
    return new Promise((resolve, rejects)=>{
        try {
           
            const resultado: Array<Acorde_Seccion> = new Array<Acorde_Seccion>();

            const query = `SELECT acorde, ubicacion FROM acordes_seccion
                           WHERE idSeccion = ?`; 
            
            pool.getConnection(function(error, connection) {
                
                connection.query(query, idSeccion, function (error, fields) {
                    connection.release();
                    console.log(idSeccion, fields)
                    // Recorremos los campos obtenidos y los insertamos 
                    // dentro de un array de acordes_seccion para retornarla luego
                    for (let i = 0; i < fields.length; i++) {
                        console.log(fields[i])
                        resultado.push(new Acorde_Seccion(fields[i]));
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
            const acorde = req.body;
            let parametros:any = [acorde.idSeccion, acorde.acorde, acorde.ubicacion];
            const query = `INSERT INTO acordes_seccion (idSeccion,acorde,ubicacion) VALUES (?,?,?) `

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
            const acorde = req.body;
            let parametros:any = [acorde.acorde, acorde.ubicacion, acorde.idSeccion];
            const query = ` UPDATE acordes_seccion SET acorde = ?
                            WHERE ubicacion = ? AND idSeccion = ? `

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

export const acordesSeccionctrl = new acordeSeccion_control();