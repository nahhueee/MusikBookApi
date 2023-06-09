import express from 'express';
import morgan from 'morgan';
var cors = require('cors')

const app = express();

//setings
app.set('port', process.env.Port || 3000);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


//Starting the server
app.listen(app.get('port'), () => {
  console.log('server on port ' + app.get('port'));
});

//#region RUTAS
import CancionesRuta from './routes/canciones_route';
app.use('/api/canciones', CancionesRuta);

import SeccionesRuta from './routes/secciones_route';
app.use('/api/secciones', SeccionesRuta);

import CategoriasRuta from './routes/categorias_route';
app.use('/api/categorias', CategoriasRuta);

import TipoCancionRuta from './routes/tipoCancion_route';
app.use('/api/tipos_cancion', TipoCancionRuta);

import TipoSeccionRuta from './routes/tipoSeccion_route';
app.use('/api/tipos_seccion', TipoSeccionRuta);
//#endregion

app.use('/',(req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Servidor de MUSIK BOOK funcionando en este puerto.');
});
