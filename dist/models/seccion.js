"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seccion = void 0;
const acorde_seccion_1 = require("./acorde_seccion");
class Seccion {
    constructor(data) {
        this.acordes = new Array();
        if (data) {
            this.id = data.id;
            this.idCancion = data.idCancion;
            this.idTipoSeccion = data.idTipoSeccion;
            this.letra = data.letra;
            // Si existen datos en data.acordes asignamos sus valores a nuestro array this.acordes, de lo contrario lo seteamos en nuevo
            data.acordes ? this.acordes = data.acordes.map(x => new acorde_seccion_1.Acorde_Seccion(x)) : this.acordes = new Array();
        }
    }
}
exports.Seccion = Seccion;
