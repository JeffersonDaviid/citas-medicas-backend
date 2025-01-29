var express = require('express');
var router = express.Router();

var PacienteController = require('../controllers/paciente.controller');

// Ver pacientes
router.get('/pacientes', PacienteController.getPacientes);

// Guardar paciente
router.post('/guardar-paciente', PacienteController.savePaciente);

// Ver un paciente
router.get('/paciente/:id', PacienteController.getPaciente);

// Actualizar paciente
router.put('/paciente/:id', PacienteController.updatePaciente);

// Eliminar paciente
router.delete('/paciente/:id', PacienteController.deletePaciente);

module.exports = router;