var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CitaSchema = new Schema({
    paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    detalles: String,
    hora: String,
    fechaRegistro: Date,
    fechaCita: Date
});

module.exports = mongoose.model('Cita', CitaSchema)
