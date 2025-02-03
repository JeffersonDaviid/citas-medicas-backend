var express = require('express')
var router = express.Router()

var CitaController = require('../controllers/cita.controller')
var authMiddleware = require('../middleware/auth.middleware')

// Home
router.get('/inicio', (req, res) => {
	CitaController.inicio(req, res);
  });
  
  // Ver citas
  router.get('/citas', authMiddleware, CitaController.getCitas);
  
  // Guardar citas
  router.post('/guardar-cita', authMiddleware, CitaController.saveCita);
  
  // Ver una cita
  router.get('/cita/:id', authMiddleware, CitaController.getCita);
  
  // Ver citas entre fechas
  router.get('/citas/:dateFrom/:dateTo', authMiddleware, CitaController.getCitaBetweenDates);
  
  // Actualizar cita
  router.put('/cita/:id', authMiddleware, CitaController.updateCita);
  
  // Eliminar cita
router.delete('/cita/:id', authMiddleware, CitaController.deleteCita);

module.exports = router;