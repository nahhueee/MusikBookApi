import { Seccion } from "./seccion";

export class Cancion{
    id? : number;
    nombre?: string;
    tonica?: string;
    bpm?: number;
    idCategoria?: number;
    idTipoCancion?: number;

    secciones: Array<Seccion> = new Array<Seccion>();
  
    constructor(data?: any) {
      if (data) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.tonica = data.tonica;
        this.bpm = data.bpm;
        this.idCategoria = data.idCategoria;
        this.idTipoCancion = data.idTipoCancion;
        // Si existen datos en data.secciones asignamos sus valores a nuestro array this.secciones, de lo contrario lo seteamos en nuevo
        data.secciones ? this.secciones = data.secciones.map(x => new Seccion(x)) : this.secciones = new Array<Seccion>();
      }
    }
  }
  
  