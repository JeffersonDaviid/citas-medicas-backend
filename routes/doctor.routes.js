var express = require('express');
var router = express.Router();
var DoctorController = require('../controllers/doctor.controller');

router.post('/login', DoctorController.loginDoctor);
router.post('/guardar-doctor', DoctorController.saveDoctor);
router.get('/doctores', DoctorController.getDoctores);
router.get('/doctor/:id', DoctorController.getDoctor);
router.put('/doctor/:id', DoctorController.updateDoctor);
router.delete('/doctor/:id', DoctorController.deleteDoctor);

module.exports = router;
