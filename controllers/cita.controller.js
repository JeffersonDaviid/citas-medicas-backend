var Cita = require('../models/cita.js')
var Doctor = require('../models/doctor.js')
var transporter = require('../nodemailer.js')
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

			// Suponiendo que params.fechaCita es un string en formato YYYY-MM-DD
			const fechaCita = params.fechaCita

			const [year, month, day] = fechaCita.split('-')
			// Asignar la fecha ajustada a cita.fechaCita
			cita.fechaCita = new Date(year, month - 1, day)

			var citaStored = await cita.save()
			if (!citaStored) {
				return res.status(404).send({ message: 'No se guardo la cita' })
			}

			// Enviar correo electrónico al usuario
			var paciente = await Usuario.findOne({ cedula: cita.cedulaPaciente })
			var doctorRes = await Doctor.findById(cita.doctor)

			const formattedDate = cita.fechaCita.toLocaleDateString('es-ES', {
				weekday: 'long', // Nombre completo del día (ej. lunes)
				day: 'numeric', // Día del mes (ej. 2)
				month: 'long', // Nombre completo del mes (ej. agosto)
				year: 'numeric', // Año (ej. 2025)
			})

			const formattedDateCapitalized =
				formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

			const mailOptions = {
				from: 'c99652451@gmail.com',
				to: paciente.email,
				subject: 'Detalles de tu cita médica',
				html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #2c3e50; text-align: center;">📅 Cita Médica Confirmada</h2>
    <p style="color: #34495e; text-align: center;">Hola <strong>${paciente.nombre}</strong>, tu cita ha sido registrada con éxito.</p>
    
    <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <p><strong>ID:</strong> ${citaStored._id}</p>
      <p><strong>Detalles:</strong> ${citaStored.detalles}</p>
      <p><strong>Especialidad:</strong> ${doctorRes.especialidad}</p>
      <p><strong>Hora:</strong> ${citaStored.hora}</p>
      <p><strong>Fecha de Cita:</strong> ${formattedDateCapitalized}</p>
    </div>

    <p style="text-align: center; margin-top: 20px;">
      📍 No olvides llegar 15 minutos antes de tu cita.
    </p>

		<p style="text-align: center; margin-top: 20px;">
  <a href="https://citas-medicas-backend.onrender.com/cancelar-cita/${citaStored._id}" 
     style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #e74c3c; text-decoration: none; border-radius: 5px;">
    Cancelar Cita
  </a>
</p>

    <p style="text-align: center; font-size: 14px; color: #7f8c8d;">
      📩 Si tienes preguntas, contáctanos a <a href="mailto:contacto@clinica.com" style="color: #3498db;">contacto@clinica.com</a>
    </p>
  </div>
  `,
			}

			var citaStored = await cita.save()
			if (!citaStored) {
				return res.status(404).send({ message: 'No se guardo la cita' })
			}

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.error('Error al enviar el correo electrónico:', error)
				} else {
					console.log('Correo electrónico enviado:', info.response)
				}
			})
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
			const { fecha } = req.query

			if (!fecha) {
				return res.status(400).send({ message: 'La fecha es requerida' })
			}

			// Convertir la fecha a objeto Date (asegurarse de que se maneja correctamente)
			const fechaInicio = new Date(fecha)
			const fechaFin = new Date(fecha)
			fechaFin.setUTCHours(23, 59, 59, 999) // Final del día

			// Buscar citas en el rango de la fecha
			const citas = await Cita.find({
				fechaCita: {
					$gte: fechaInicio, // Inicio del día
					$lte: fechaFin, // Fin del día
				},
			})

			if (!citas || citas.length === 0) {
				return res.status(404).send({ message: 'No hay citas para esta fecha' })
			}

			return res.status(200).send({ citas })
		} catch (error) {
			console.error('Error al obtener citas por fecha:', error)
			return res.status(500).send({ message: 'Error al obtener citas', error })
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

	deleteCitaEmail: async function (req, res) {
		try {
			var citaId = req.params.id
			var cita = await Cita.findById(citaId)
			if (!cita) return res.status(404).send({ message: 'La cita no existe' })
			var paciente = await Usuario.findOne({ cedula: cita.cedulaPaciente })
			if (!paciente) return res.status(404).send({ message: 'El paciente no existe' })
			var doctorRes = await Doctor.findById(cita.doctor)
			if (!doctorRes) return res.status(404).send({ message: 'El doctor no existe' })

			const formattedDate = cita.fechaCita.toLocaleDateString('es-ES', {
				weekday: 'long', // Nombre completo del día (ej. lunes)
				day: 'numeric', // Día del mes (ej. 2)
				month: 'long', // Nombre completo del mes (ej. agosto)
				year: 'numeric', // Año (ej. 2025)
			})

			const formattedDateCapitalized =
				formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

			const mailOptions = {
				from: 'c99652451@gmail.com',
				to: paciente.email,
				subject: 'Tu cita médica ha sido cancelada',
				html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
					<h2 style="color: #e74c3c; text-align: center;">❌ Cita Médica Cancelada</h2>
					<p style="color: #34495e; text-align: center;">Hola <strong>${paciente.nombre}</strong>, lamentamos informarte que tu cita ha sido cancelada.</p>
					
					<div style="background-color: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
						<p><strong>ID:</strong> ${cita._id}</p>
						<p><strong>Detalles:</strong> ${cita.detalles}</p>
						<p><strong>Especialidad:</strong> ${doctorRes.especialidad}</p>
						<p><strong>Hora:</strong> ${cita.hora}</p>
						<p><strong>Fecha de Cita:</strong> ${formattedDateCapitalized}</p>
					</div>
			
					<p style="text-align: center; margin-top: 20px; font-weight: bold; color: #e74c3c;">
						⚠️ Si esta cancelación fue un error, por favor contacta con nosotros.
					</p>
			
					<p style="text-align: center;">
						📩 Contáctanos en <a href="mailto:contacto@clinica.com" style="color: #3498db;">contacto@clinica.com</a> para más información.
					</p>
				</div>
				`,
			}
			var citaRemoved = await Cita.findByIdAndDelete(citaId)
			if (!citaRemoved) return res.status(404).send({ message: 'La cita no existe' })
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.error('Error al enviar el correo electrónico:', error)
				} else {
					console.log('Correo electrónico enviado:', info.response)
				}
			})
			return res.status(200).send(`<h2>La cita ha sido cancelada</h2>`)
		} catch (error) {
			console.log(error)
			return res.status(500).send({ message: 'Error al eliminar la cita' })
		}
	},
}
module.exports = controller
