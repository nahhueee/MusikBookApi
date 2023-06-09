"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Acorde_Seccion = void 0;
class Acorde_Seccion {
    constructor(data) {
        if (data) {
            this.idSeccion = data.idSeccion;
            this.acorde = data.acorde;
            this.ubicacion = data.ubicacion;
        }
    }
}
exports.Acorde_Seccion = Acorde_Seccion;
