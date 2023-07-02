export class Acorde{
    idCancion? : number;
    acorde?: string;
    ubicacion?: string;
    
    constructor(data?: any) {
      if (data) {
        this.idCancion = data.idCancion;
        this.acorde = data.acorde;
        this.ubicacion = data.ubicacion;
      }
    }
  }