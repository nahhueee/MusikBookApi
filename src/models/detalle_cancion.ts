import { Acorde } from "./acorde";
import { Seccion } from "./seccion";

export class DetalleCancion{
    idCancion?: number;
    acordes: Array<Acorde> = new Array<Acorde>();
    secciones: Array<Seccion> = new Array<Seccion>();

    constructor(data?: any) {
      if (data) {
        this.idCancion = data.idCancion;
        
        // Si existen datos en data.acordes asignamos sus valores a nuestro array this.acordes, de lo contrario lo seteamos en nuevo
        data.acordes ? this.acordes = data.acordes.map(x => new Acorde(x)) : this.acordes = new Array<Acorde>();
        // Si existen datos en data.seccion asignamos sus valores a nuestro array this.seccion, de lo contrario lo seteamos en nuevo
        data.secciones ? this.secciones = data.secciones.map(x => new Seccion(x)) : this.secciones = new Array<Seccion>();
      }
    }
  }