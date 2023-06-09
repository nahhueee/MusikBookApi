import {Request, Response} from 'express';
import { Cancion } from '../models/cancion';
import {seccionesctrl} from '../controllers/secciones_control';

var pool = require('../db').pool;

class canciones_control{
//#region OBTENER
    async ObtenerTotalCanciones(req:Request,res:Response){
        try {
            //Obtengo los datos de paginacion y filtros
            const filtroTabla = req.body; 

            //Armo la query
            const query = await ObtenerQuery(filtroTabla, true);    
        
            pool.getConnection(function(error,connection) {
                        
                connection.query(query, function (error, fields) {
                    connection.release();
            
                    if (error) 
                        HandlearError(req,res,"db",error);

                    res.json(fields[0].total);
                });
            });
        } catch (error:any) {
            HandlearError(req,res,"interno",error);
        }
    };

    async ObtenerCanciones(req:Request, res:Response){
        try {
            //Obtengo los datos de paginacion y filtros
            const filtroTabla = req.body; 

            //Armo la query
            const query = await ObtenerQuery(filtroTabla, false);
                
            pool.getConnection(function(error, connection) {
                
                connection.query(query, function (error, fields) {
                    connection.release();
            
                    // Handle error after the release.
                    if (error) 
                        HandlearError(req,res,"db",error);
                    
                    res.json(fields);
                });
            });
        } catch (error:any) {
            HandlearError(req,res,"interno",error);
        }
    };

    ObtenerCancion(req:Request, res:Response){
        try {
            // Recibimos el id de la cancion
            const idCancion = req.params.cancion;
            // Creamos la query
            const query = `SELECT * FROM canciones WHERE id = ?`; 
            
            const cancion = new Cancion();

            pool.getConnection(function(error, connection) {
                
                connection.query(query, idCancion, async function (error, fields) {
                    connection.release();
            
                    // Handle error after the release.
                    if (error) 
                        HandlearError(req,res,"db",error);
                    
                    //#region CANCION DE RESPUESTA    
                    cancion.id = fields[0].id;
                    cancion.nombre = fields[0].nombre;
                    cancion.bpm = fields[0].bpm;    
                    cancion.tonica = fields[0].tonica;    
                    cancion.idCategoria = fields[0].idCategoria;    
                    cancion.idTipoCancion = fields[0].idTipoCancion;
                    //#endregion    
                
                    // Obtenemos las secciones de la cancion
                    cancion.secciones = await seccionesctrl.ObtenerSeccionesCancion(parseInt(idCancion));

                    res.json(cancion)
                });
            });
            
        } catch (error:any) {
            console.log(error)
            HandlearError(req,res,"interno",error);
        }
    }

    //#region ABM
    Agregar(req:Request, res:Response){
        try {
            const cancion = req.body;
            let parametros:any = [cancion.nombre, cancion.tonica, cancion.bpm, cancion.idCategoria, cancion.idTipoCancion];
            const query = `INSERT INTO canciones (nombre,tonica,bpm,idCategoria,idTipoCancion) VALUES (?,?,?,?,?) `

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
            const cancion = req.body;
            let parametros:any = [cancion.nombre, cancion.tonica, cancion.bpm, cancion.idCategoria, cancion.idTipoCancion, cancion.id];
            const query = ` UPDATE canciones SET nombre = ?, tonica = ?, bpm = ?, idcategoria = ?, idTipoCancion = ?
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


    // TODO Revisar el eliminar cancion
    async Eliminar(req:Request, res:Response){
        try {
            const data = req.body;
            
            pool.getConnection(function(error, connection) {
                connection.beginTransaction(function(error) {
                    if (error) {//ERROR AL INICIAR LA TRANSACCION (Rollback y Liberar conexion)
                        connection.rollback(function() {
                            connection.release();
                            HandlearError(req,res,"db",error);
                        });
                    } else {
                        //#region ELIMINAR ACORDES CANCION
                            let sql1 = `DELETE acordes_cancion
                                        WHERE idcancion = ? `;
                            connection.query(sql1, data.cancion, function (error, fields) {
                                if (error) {//ERROR EN QUERY (Rollback y Liberar conexion)
                                    connection.rollback(function() {
                                        connection.release();
                                        HandlearError(req,res,"db",error);
                                    });
                                }
                            });
                        //#endregion
                        
                        let query = `DELETE FROM canciones
                                     WHERE id = ? `;
                        connection.query(query, data.cancion, function (error, fields) {
                            if (error) {//ERROR EN QUERY (Rollback y Liberar conexion)
                                connection.rollback(function() {
                                    connection.release();
                                    HandlearError(req,res,"db",error);
                                });
                            }else{
                                connection.commit(function(err) {
                                if (err) {//ERROR AL INTENTAR COMMITEAR (Rollback y Liberar conexion)
                                    connection.rollback(function() {
                                        connection.release();
                                        HandlearError(req,res,"db",err);
                                    });
                                } else { //TRANSACCION REALIZADA CORRECTAMENTE
                                    connection.release();
                                    res.json('OK');
                                } 
                            });
                            }
                        });
                    }    
                });
            });
            
        } catch (error:any) {
            HandlearError(req,res,"interno",error);
        }
    }
//#endregion
}

//#region FUNCIONES PRIVADAS

// Obtiene una query de canciones y el total de registros si se requiere / Usado para paginación
function ObtenerQuery(filtroTabla:any, estotal:boolean):Promise<string>{
    return new Promise((resolve, rejects)=>{
        let query:string= '';
        let paginacion='';
        let filtro='';
        
        if(filtroTabla.filtro!="")
            filtro = " WHERE nombre LIKE '%" + filtroTabla.filtro + "%'";

        if(!estotal)
           paginacion = " LIMIT "+ filtroTabla.tamanioPagina + " OFFSET " + ((filtroTabla.pagina - 1) * filtroTabla.tamanioPagina);

        let count = estotal ? "SELECT COUNT (*) AS total FROM ( " : "";
        let endCount = estotal ? " ) as subquery" : "";
        
        query = count + 
                ` SELECT * from canciones `
                + filtro //WHERE
                + ` ORDER BY id DESC `
                + paginacion //LIMIT
                + endCount;         
        
        resolve(query);
    })
}

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

export const cancionesctrl = new canciones_control();