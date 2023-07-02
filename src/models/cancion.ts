import { DetalleCancion } from "./detalle_cancion";

export class Cancion{
    id? : number;
    nombre?: string;
    tonica?: string;
    bpm?: number;
    idCategoria?: number;
    idTipoCancion?: number;

    detalle: DetalleCancion = new DetalleCancion();
  
    constructor(data?: any) {
      if (data) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.tonica = data.tonica;
        this.bpm = data.bpm;
        this.idCategoria = data.idCategoria;
        this.idTipoCancion = data.idTipoCancion;
        this.detalle = new DetalleCancion(data.detalle);
      }
    }
  }
  
  