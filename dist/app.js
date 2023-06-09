"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
var cors = require('cors');
const app = (0, express_1.default)();
//setings
app.set('port', process.env.Port || 3000);
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors());
//Starting the server
app.listen(app.get('port'), () => {
    console.log('server on port ' + app.get('port'));
});
//#region RUTAS
const canciones_route_1 = __importDefault(require("./routes/canciones_route"));
app.use('/api/canciones', canciones_route_1.default);
const secciones_route_1 = __importDefault(require("./routes/secciones_route"));
app.use('/api/secciones', secciones_route_1.default);
const categorias_route_1 = __importDefault(require("./routes/categorias_route"));
app.use('/api/categorias', categorias_route_1.default);
const tipoCancion_route_1 = __importDefault(require("./routes/tipoCancion_route"));
app.use('/api/tipos_cancion', tipoCancion_route_1.default);
const tipoSeccion_route_1 = __importDefault(require("./routes/tipoSeccion_route"));
app.use('/api/tipos_seccion', tipoSeccion_route_1.default);
//#endregion
app.use('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Servidor de MUSIK BOOK funcionando en este puerto.');
});
