import {Request, Response} from 'express';
import { Cancion } from '../models/cancion';
import { Seccion } from '../models/seccion';
import { Acorde } from '../models/acorde';
import { DetalleCancion } from '../models/detalle_cancion';

var pool = require('../db').pool;

class canciones_control{
//#region OBTENER
    async ObtenerTotalCanciones(req:Request,res:Response){
        try {
            //Obtengo los datos de paginacion y filtros
            const filtrosCancion = req.body; 

            //Armo la query
            const query = await ObtenerQuery(filtrosCancion, true);    
        
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
            const filtrosCancion = req.body; 

            //Armo la query
            const query = await ObtenerQuery(filtrosCancion, false);
                
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
                
                    //Creamos el objeto detalle y lo llenamos con las secciones y acordes
                    const detalle: DetalleCancion = new DetalleCancion();
                    detalle.idCancion = cancion.id;

                    detalle.secciones = await ObtenerSeccionesCancion(cancion.id);
                    detalle.acordes = await ObtenerAcordesCancion(cancion.id);

                    res.json(cancion)
                });
            });
            
        } catch (error:any) {
            console.log(error)
            HandlearError(req,res,"interno",error);
        }
    }

    ExisteCancion(req:Request, res:Response){
        try {
            // Recibimos los datos de la cancion a buscar existencia
            const cancion = req.body;
            let parametros:any = [cancion.nombre, cancion.idTipoCancion];

            // Creamos la query
            const query = `SELECT id FROM canciones WHERE nombre = ? AND idTipoCancion = ?`; 
            
            pool.getConnection(function(error, connection) {
                
                connection.query(query, parametros, async function (error, fields) {
                    connection.release();
            
                    // Handle error after the release.
                    if (error) 
                        HandlearError(req,res,"db",error);
                    
                    if(fields.length>0){
                        res.json("Existe")
                    }else{
                        res.json("NoExiste")
                    }
                    
                });
            });
            
        } catch (error:any) {
            console.log(error)
            HandlearError(req,res,"interno",error);
        }
    }
//#endregion
//#region ABM
    Agregar(req:Request, res:Response){
        try {
            const cancion = req.body;
            let parametros:any = [cancion.nombre, cancion.tonica, cancion.bpm, cancion.idCategoria, cancion.idTipoCancion];
            const query = `INSERT INTO canciones (nombre,tonica,bpm,idCategoria,idTipoCancion) VALUES (?,?,?,?,?) `

            pool.getConnection(function(error, connection) {
                
                connection.query(query, parametros, async function (error, fields) {
                    connection.release();
            
                    // Handle error after the release.
                    if (error) 
                        HandlearError(req,res,"db",error);

                    //Obtiene y devuelve el último id insertado
                    const idCancion = await ObtenerUltimaCancion();
                    
                    if(idCancion!=-1){
                        res.json(idCancion);
                    }else{
                        HandlearError(req,res,"db","No se logró obtener el último id");
                    }
                        
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
// Obtiene la última canción agregada
function ObtenerUltimaCancion():Promise<number>{
    return new Promise((resolve, rejects)=>{
        try {
            // Creamos la query
            const query = `SELECT id FROM canciones ORDER BY id DESC LIMIT 1`; 
            
            pool.getConnection(function(error, connection) {
                
                connection.query(query, function (error, fields) {
                    connection.release();
            
                    // Handle error after the release.
                    if (error) 
                        rejects(-1);
                    
                        resolve(fields[0].id);
                });
            });
            
        } catch (error:any) {
            console.log(error)
            rejects(-1);
        }
    })
}

// Obtiene una query de canciones y el total de registros si se requiere / Usado para paginación
function ObtenerQuery(filtrosCancion:any, estotal:boolean):Promise<string>{
    return new Promise((resolve, rejects)=>{
        let query:string= '';
        let paginacion='';
        let filtro='';
        
        if(filtrosCancion.nombre!="")
            filtro = " AND nombre LIKE '%" + filtrosCancion.nombre + "%'";

        if(!estotal)
           paginacion = " LIMIT "+ filtrosCancion.paginacion.tamanioPagina + " OFFSET " + ((filtrosCancion.paginacion.pagina - 1) * filtrosCancion.paginacion.tamanioPagina);

        let count = estotal ? "SELECT COUNT (*) AS total FROM ( " : "";
        let endCount = estotal ? " ) as subquery" : "";
        
        query = count + 
                ` SELECT * from canciones 
                  WHERE idTipoCancion = `
                + filtrosCancion.tipo
                + filtro //AND filtro nombre
                + ` ORDER BY id DESC `
                + paginacion //LIMIT
                + endCount;         
        
        resolve(query);
    })
}

// Obtiene las secciones de una cancion
function ObtenerSeccionesCancion(idCancion):Promise<Array<Seccion>>{
    return new Promise((resolve, rejects)=>{
        let resultado: Array<Seccion> = new Array<Seccion>;

        const query = `SELECT s.id, s.letra, ts.nombre tipoSeccion FROM secciones s
                       INNER JOIN tipo_seccion ts ON ts.id = s.idTipoSeccion
                       WHERE idCancion = ?`; 
        
        const seccion = new Seccion();

        pool.getConnection(function(error, connection) {
            
            connection.query(query, idCancion, async function (error, fields) {
                connection.release();

                // Recorremos los campos obtenidos y los insertamos 
                // dentro de un array de secciones para retornarla luego
                for (let i = 0; i < fields.length; i++) {
                    //#region CARGA DE OBJETO
                        seccion.idCancion = fields[i].idcancion;
                        seccion.idTipoSeccion = fields[i].idTipoSeccion;
                        seccion.letra = fields[i].letra;
                    //#endregion

                    resultado.push(seccion);
                }
            });
        });

        resolve(resultado);
    })
}

// Obtiene los acordes de una cancion
function ObtenerAcordesCancion(idCancion):Promise<Array<Acorde>>{
    return new Promise((resolve, rejects)=>{
        let resultado: Array<Acorde> = new Array<Acorde>;

        const query = `SELECT idCancion, acorde, ubicacion
                       WHERE idCancion = ?`; 
        
        const acorde = new Acorde();

        pool.getConnection(function(error, connection) {
            
            connection.query(query, idCancion, async function (error, fields) {
                connection.release();

                // Recorremos los campos obtenidos y los insertamos 
                // dentro de un array de acordes para retornarla luego
                for (let i = 0; i < fields.length; i++) {
                    //#region CARGA DE OBJETO
                        acorde.idCancion = fields[i].idcancion;
                        acorde.acorde = fields[i].acorde;
                        acorde.ubicacion = fields[i].ubicacion;
                    //#endregion

                    resultado.push(acorde);
                }
            });
        });

        resolve(resultado);
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