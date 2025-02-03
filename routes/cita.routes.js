var express = require('express')
var router = express.Router()

var CitaController = require('../controllers/cita.controller')
var multiparty = require('connect-multiparty')
var multipartyMiddleware = multiparty({ uploadDir: './uploads' })

// Home
router.get('/inicio', (req, res) => {
	CitaController.inicio(req, res)
})

// Ver citas
router.get('/citas', CitaController.getCitas)

// guardar citas
router.post('/guardar-cita', CitaController.saveCita)

// ver una cita
router.get('/cita/:id', CitaController.getCita)

// Obtener citas por una fecha específica
router.get('/citas-por-fecha', CitaController.getCitasPorFecha);

// ver citas entre fechas
router.get('/citas/:dateFrom/:dateTo', CitaController.getCitaBetweenDates)

// actualizar cita
router.put('/cita/:id', CitaController.updateCita)

// eliminar cita
router.delete('/cita/:id', CitaController.deleteCita)

module.exports = router
