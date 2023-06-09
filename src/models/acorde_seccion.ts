export class Acorde_Seccion{
    idSeccion? : number;
    acorde?: string;
    ubicacion?: number;
    
    constructor(data?: any) {
      if (data) {
        this.idSeccion = data.idSeccion;
        this.acorde = data.acorde;
        this.ubicacion = data.ubicacion;
       }
    }
  }
  