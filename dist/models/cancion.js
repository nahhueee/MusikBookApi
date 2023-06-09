"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cancion = void 0;
const seccion_1 = require("./seccion");
class Cancion {
    constructor(data) {
        this.secciones = new Array();
        if (data) {
            this.id = data.id;
            this.nombre = data.nombre;
            this.tonica = data.tonica;
            this.bpm = data.bpm;
            this.idCategoria = data.idCategoria;
            this.idTipoCancion = data.idTipoCancion;
            // Si existen datos en data.secciones asignamos sus valores a nuestro array this.secciones, de lo contrario lo seteamos en nuevo
            data.secciones ? this.secciones = data.secciones.map(x => new seccion_1.Seccion(x)) : this.secciones = new Array();
        }
    }
}
exports.Cancion = Cancion;
