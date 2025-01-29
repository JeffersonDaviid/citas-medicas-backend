const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horario.controller');

router.get('/horarios', horarioController.getHorario);
router.get('/doctores', horarioController.getDoctores);
module.exports = router;
