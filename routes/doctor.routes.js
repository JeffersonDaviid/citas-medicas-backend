var express = require('express');
var router = express.Router();

var DoctorController = require('../controllers/doctor.controller');

// Ver doctores
router.get('/doctores', DoctorController.getDoctores);

// Guardar doctor
router.post('/guardar-doctor', DoctorController.saveDoctor);

// Ver un doctor
router.get('/doctor/:id', DoctorController.getDoctor);

// Actualizar doctor
router.put('/doctor/:id', DoctorController.updateDoctor);

// Eliminar doctor
router.delete('/doctor/:id', DoctorController.deleteDoctor);

module.exports = router;