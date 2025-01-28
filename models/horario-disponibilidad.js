var mongoose = require('mongoose')
var Schema = mongoose.Schema

var HorarioDisponibilidadSchema = new Schema({
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    dia: String,
    hora: String,
    estado: { type: String, enum: ['ocupado', 'disponible'], default: 'disponible' }
});
module.exports = mongoose.model('Horario-Disponibilidad', HorarioDisponibilidadSchema)
