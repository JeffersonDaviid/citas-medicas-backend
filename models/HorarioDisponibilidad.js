const mongoose = require('mongoose');

const HorarioSchema = new mongoose.Schema({
    _id: { type: String, required: true }, 
    doctor: { type: String, required: true }, 
    fecha: { type: String, required: true }, // Fecha en formato YYYY-MM-DD
    hora: { type: String, required: true }, // Hora en formato HH:mm
    estado: { type: String, enum: ['Disponible', 'Ocupado'], default: 'Disponible' } 
}, { collection: 'horarios' });

module.exports = mongoose.model('HorarioDisponibilidad', HorarioSchema);
