var mongoose = require('mongoose')
var Schema = mongoose.Schema

var HorarioDisponibilidadSchema = new Schema({
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    dia: String,
    hora: [String]
});
module.exports = mongoose.model('Horario-Disponibilidad', HorarioDisponibilidadSchema)
