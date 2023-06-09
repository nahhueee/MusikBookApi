import { Acorde_Seccion } from "./acorde_seccion";

export class Seccion{
    id? : number;
    idCancion?: number;
    idTipoSeccion?: number;
    letra?: string;
    acordes: Array<Acorde_Seccion> = new Array<Acorde_Seccion>();

    constructor(data?: any) {
      if (data) {
        this.id = data.id;
        this.idCancion = data.idCancion;
        this.idTipoSeccion = data.idTipoSeccion;
        this.letra = data.letra;
        // Si existen datos en data.acordes asignamos sus valores a nuestro array this.acordes, de lo contrario lo seteamos en nuevo
        data.acordes ? this.acordes = data.acordes.map(x => new Acorde_Seccion(x)) : this.acordes = new Array<Acorde_Seccion>();
      }
    }
  }
  
  