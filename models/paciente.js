var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PacienteSchema = new Schema({
    nombre: String,
    correo: String,
    contrasena: String
});

module.exports = mongoose.model('Paciente', PacienteSchema)
