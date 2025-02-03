var Cita = require('../models/cita.js')
var transporter = require('../nodemailer.js')
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
    var cita = new Cita();
    var params = req.body;
    cita.cedulaPaciente = params.cedulaPaciente;
    cita.detalles = params.detalles;
    cita.hora = params.hora;
	cita.doctor = params.doctor;
    cita.fechaRegistro = new Date();

    // Suponiendo que params.fechaCita es un string o un objeto Date
    const fechaCita = new Date(params.fechaCita); // Convertir a objeto Date si no lo es

    // Ajustar la hora a las 12:00 PM (mediodía) en UTC
    const year = fechaCita.getUTCFullYear();
    const month = fechaCita.getUTCMonth();
    const day = fechaCita.getUTCDate();
    const fechaCitaAjustada = new Date(Date.UTC(year, month, day, 12, 0, 0)); // 12:00 PM UTC

    // Asignar la fecha ajustada a cita.fechaCita
    cita.fechaCita = fechaCitaAjustada;

    var citaStored = await cita.save();
    if (!citaStored) {
      return res.status(404).send({ message: 'No se guardo la cita' });
    }

	// Enviar correo electrónico al usuario
	const userEmail = req.user.email; // Asegúrate de que el correo electrónico del usuario esté disponible en req.user
	const mailOptions = {
	  from: 'c99652451@gmail.com',
	  to: userEmail,
	  subject: 'Detalles de tu cita médica',
	  text: `Hola, tu cita ha sido registrada con éxito. Aquí están los detalles:\n\n
			 ID: ${citaStored._id}\n
			 Paciente: ${citaStored.cedulaPaciente}\n
			 Detalles: ${citaStored.detalles}\n
			 Hora: ${citaStored.hora}\n
			 Fecha de Cita: ${citaStored.fechaCita}\n`
	};

	transporter.sendMail(mailOptions, (error, info) => {
	  if (error) {
		console.error('Error al enviar el correo electrónico:', error);
	  } else {
		console.log('Correo electrónico enviado:', info.response);
	  }
	});


    return res.status(201).send({ cita: citaStored });
  } catch (error) {
    console.error('Error al guardar la cita:', error);
    return res.status(500).send({ message: 'Error al guardar los datos', error });
  }
},

	getCita: async function (req, res) {
		try {
			var citaId = req.params.id
			if (!citaId) return res.status(404).send({ message: 'La cita no existe' })
			var cita = await Cita.findById(citaId)
			if (!cita) return res.status(404).send({ message: 'La cita no existe' })
			return res.status(200).send(cita)
		} catch (error) {
			return res.status(500).send({ message: 'Error al recuperar los datos' })
		}
	},

	getCitaBetweenDates: async function (req, res) {
		try {
			var fechaInicio = new Date(req.params.dateFrom)
			var fechaFin = new Date(req.params.dateTo)
			if (!fechaInicio || !fechaFin)
				return res.status(404).send({ message: 'Las fechas son requeridas' })
			var citas = await Cita.find({
				fechaCita: { $gte: fechaInicio, $lte: fechaFin },
			})
			if (!citas) return res.status(404).send({ message: 'No hay citas' })
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
