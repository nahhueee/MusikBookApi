export class Seccion{
    idCancion?: number;
    idTipoSeccion?: number;
    letra?: string;
    
    constructor(data?: any) {
      if (data) {
        this.idCancion = data.idCancion;
        this.idTipoSeccion = data.idTipoSeccion;
        this.letra = data.letra;
      }
    }
  }
  
  