var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CitaSchema = new Schema({
	cedulaPaciente: String,
	detalles: String,
	hora: String,
	fechaRegistro: Date,
	fechaCita: Date,
	doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' }})

module.exports = mongoose.model('Cita', CitaSchema)
