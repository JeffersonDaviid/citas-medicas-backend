var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var citaRoutes = require('./routes/cita.routes');
var pacienteRoutes = require('./routes/paciente.routes');
var horarioDisponibilidadRoutes = require('./routes/horario-disponibilidad.routes');
var doctorRoutes = require('./routes/doctor.routes');
var usuarioRoutes = require('./routes/usuario.routes');

// Middleware para BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Permitir solo desde Angular
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/', citaRoutes);
app.use('/', pacienteRoutes);
app.use('/', horarioDisponibilidadRoutes);
app.use('/', doctorRoutes);

module.exports = app;