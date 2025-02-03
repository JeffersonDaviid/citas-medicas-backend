const Cita = require('../models/cita.js')
const Doctor = require('../models/doctor.js')
const Usuario = require('../models/usuario.js')
var controller = {
	inicio: function (req, res) {
		return res
			.status(200)
			.send({ message: '<h1>BIENVENIDOS A CITAS MÉDICAS ONLINES</h1>' })
	},

	getCitas: async function (req, res) {
		try {
			const citas = await Cita.find({}).sort()
			if (citas.lenght === 0) {
				return res.status(404).send({ message: 'No hay citas' })
			}
			return res.status(200).send({ citas })
		} catch (error) {
			return res.status(500).send({ message: 'Error al recuperar los datos' })
		}
	},

	saveCita: async function (req, res) {
		try {
			var cita = new Cita()
			var params = req.body
			cita.cedulaPaciente = params.cedulaPaciente
			cita.detalles = params.detalles
			cita.hora = params.hora
			cita.doctor = params.doctor
			cita.fechaRegistro = new Date()

			// Suponiendo que params.fechaCita es un string en formato DD-MM-YYYY
			const [day, month, year] = params.fechaCita.split('-')
			const fechaCita = new Date(`${year}-${month}-${day}`) // Convertir a objeto Date en formato YYYY-MM-DD

			// Ajustar la hora a las 12:00 PM (mediodía) en UTC
			const fechaCitaAjustada = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)) // 12:00 PM UTC

			// Asignar la fecha ajustada a cita.fechaCita
			cita.fechaCita = fechaCitaAjustada

			var citaStored = await cita.save()
			if (!citaStored) {
				return res.status(404).send({ message: 'No se guardo la cita' })
			}
			return res.status(201).send({ cita: citaStored })
		} catch (error) {
			console.error('Error al guardar la cita:', error)
			return res.status(500).send({ message: 'Error al guardar los datos', error })
		}
	},

	getCita: async function (req, res) {
		try {
			var citaId = req.params.id
			if (!citaId) return res.status(404).send({ message: 'La cita no existe' })
			var cita = await Cita.findById(citaId)
			if (!cita) return res.status(404).send({ message: 'La cita no existe' })
			var paciente = await Usuario.findOne({ cedula: cita.cedulaPaciente })
			if (!paciente) return res.status(404).send({ message: 'El paciente no existe' })
			var doctorRes = await Doctor.findById(cita.doctor)
			if (!doctorRes) return res.status(404).send({ message: 'El doctor no existe' })

			var citaObj = {
				_id: cita._id,
				fechaCita: cita.fechaCita,
				hora: cita.hora,
				detalles: cita.detalles,
				paciente: {
					nombre: paciente.nombre,
					cedula: paciente.cedula,
					telefono: paciente.telefono,
					email: paciente.email,
				},
				doctor: {
					nombre: doctorRes.nombre,
					especialidad: doctorRes.especialidad,
				},
			}

			return res.status(200).send(citaObj)
		} catch (error) {
			return res.status(500).send({ message: 'Error al recuperar los datos' })
		}
	},
	
	getCitasPorFecha: async function (req, res) {
		try {
			// Capturar la fecha del parámetro de consulta
			const { fecha } = req.query;
	
			if (!fecha) {
				return res.status(400).send({ message: 'La fecha es requerida' });
			}
	
			// Convertir la fecha a objeto Date (asegurarse de que se maneja correctamente)
			const fechaInicio = new Date(fecha);
			const fechaFin = new Date(fecha);
			fechaFin.setUTCHours(23, 59, 59, 999); // Final del día
	
			// Buscar citas en el rango de la fecha
			const citas = await Cita.find({
				fechaCita: {
					$gte: fechaInicio, // Inicio del día
					$lte: fechaFin,    // Fin del día
				},
			});
	
			if (!citas || citas.length === 0) {
				return res.status(404).send({ message: 'No hay citas para esta fecha' });
			}
	
			return res.status(200).send({ citas });
		} catch (error) {
			console.error('Error al obtener citas por fecha:', error);
			return res.status(500).send({ message: 'Error al obtener citas', error });
		}
	},
	
	getCitaBetweenDates: async function (req, res) {
		try {
			var fechaInicio = new Date(req.params.dateFrom)
			var fechaFin = new Date(req.params.dateTo)
			if (!fechaInicio || !fechaFin)
				return res.status(404).send({ message: 'Las fechas son requeridas' })
			var citas = await Cita.find({ fechaCita: { $gte: fechaInicio, $lt: fechaFin } })
			if (citas.length === 0) return res.status(204).send({ message: 'No hay citas' })
			return res.status(200).send(citas)
		} catch (error) {
			return res.status(500).send({ message: 'Error al recuperar los datos' })
		}
	},

	updateCita: async function (req, res) {
		try {
			var libroId = req.params.id
			var update = req.body

			var libroUpdate = await Cita.findByIdAndUpdate(libroId, update, { new: true })
			if (!libroUpdate)
				return res.status(404).send({ message: 'El libro no se ha actualizado' })
			return res.status(200).send({ libro: libroUpdate })
		} catch (error) {
			return res.status(500).send({ message: 'Error al actualizar los datos' })
		}
	},

	deleteCita: async function (req, res) {
		try {
			var citaId = req.params.id
			var citaRemoved = await Cita.findByIdAndDelete(citaId)
			if (!citaRemoved)
				return res.status(404).send({ message: 'La cita no se puede eliminar' })
			return res.status(200).send({ citaRemoved })
		} catch (error) {
			return res.status(500).send({ message: 'Error al eliminar los datos' })
		}
	},
}
module.exports = controller
