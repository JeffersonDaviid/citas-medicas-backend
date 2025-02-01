var express = require('express');
var router = express.Router();

var HorarioDisponibilidadController = require('../controllers/horario-disponibilidad.controller');

// Ver horarios
router.get('/horarios', HorarioDisponibilidadController.getHorarios);

// Guardar horario
router.post('/guardar-horario', HorarioDisponibilidadController.saveHorario);

// Ver un horario
router.get('/horario/:id', HorarioDisponibilidadController.getHorario);

// Actualizar horario
router.put('/horario/:id', HorarioDisponibilidadController.updateHorario);

// Eliminar horario
router.delete('/horario/:id', HorarioDisponibilidadController.deleteHorario);

//Horarios disponibles doctor y fecha
router.get('/horariosD', HorarioDisponibilidadController.getHorarioD)

module.exports = router;